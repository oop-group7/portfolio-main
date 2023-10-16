package net.bestcompany.foliowatch.controllers;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.exceptions.TokenRefreshException;
import net.bestcompany.foliowatch.models.RefreshToken;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.payload.request.LoginRequest;
import net.bestcompany.foliowatch.payload.request.ResetPasswordRequest;
import net.bestcompany.foliowatch.payload.request.SignupRequest;
import net.bestcompany.foliowatch.payload.request.TokenRefreshRequest;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.JwtResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.payload.response.SignUpResponse;
import net.bestcompany.foliowatch.payload.response.TokenRefreshResponse;
import net.bestcompany.foliowatch.security.jwt.JwtUtils;
import net.bestcompany.foliowatch.security.services.IRefreshTokenService;
import net.bestcompany.foliowatch.security.services.IRegistrationUserService;
import net.bestcompany.foliowatch.security.services.ISecurityUserService;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.TokenState;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.utils.Utils;

@Controller
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication APIs")
@TimeLimiter(name = "db")
@Retry(name = "db")
@CircuitBreaker(name = "db")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private IUserService userService;

    @Autowired
    private ISecurityUserService securityUserService;

    @Autowired
    private IRegistrationUserService registrationUserService;

    @Autowired
    private IRefreshTokenService refreshTokenService;

    @PostMapping("/signin")
    @ResponseBody
    @Operation(summary = "Sign in to the website", description = "Authenticates a user with the provided login credentials and returns a JWT token upon successful authentication.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful sign in", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = JwtResponse.class)) }),
            @ApiResponse(responseCode = "401", description = "Wrong credentials.")
    })
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
        return ResponseEntity.ok(
                new JwtResponse(jwt, userDetails.getId(), userDetails.getFirstName(), userDetails.getEmail(), roles,
                        refreshToken.getToken(), userDetails.getUsername()));
    }

    @PostMapping("/refresh")
    @ResponseBody
    @Operation(summary = "Get new access token upon expiration", description = "This endpoint is used to refresh a user's JWT token. The user must be logged in to use this endpoint. The user must also have a valid refresh token. If the user does not have a valid refresh token, they must log in again. If the user has a valid refresh token, a new JWT token is generated and returned to the user. The user's refresh token is also updated in the database. The user must use the new JWT token for all future requests. The old JWT token will no longer be valid.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful refresh.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = TokenRefreshResponse.class)) }),
            @ApiResponse(responseCode = "403", description = Constants.GENERIC_BAD_REQUEST, content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        try {
            String requestRefreshToken = request.getRefreshToken();
            var res = refreshTokenService.findByToken(requestRefreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getUser).map(user -> {
                        String token = jwtUtils.generateTokenFromEmail(user.getEmail());
                        return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                    });
            if (res.isPresent()) {
                return res.get();
            } else {
                return ResponseEntity.status(403).body(new ErrorResponse("Refresh token is not in database."));
            }
        } catch (TokenRefreshException e) {
            return ResponseEntity.status(403).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/signup")
    @ResponseBody
    @Operation(summary = "Register new user", description = "Registers a new user with the provided signup credentials. If the user is successfully registered, a verification email is sent to the user. The user must verify their email before they can login. Remember to check that your password meets the required password requirements (between 8-25 characters, has at least a symbol, a numeric character, and an upper and lowercase letter).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful registration", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = JwtResponse.class)) }),
            @ApiResponse(responseCode = "400", description = Constants.GENERIC_BAD_REQUEST, content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) }),
            @ApiResponse(responseCode = "500", description = "Error in Java mail configuration.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletRequest request) {
        try {
            User user = userService.registerNewUserAccount(signUpRequest, request);
            VerificationToken token = registrationUserService.sendRegistrationVerificationEmail(user, request);
            return ResponseEntity.ok(new SignUpResponse(token.getToken()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/registrationconfirm")
    public String confirmRegistration(HttpServletRequest request, Model model, @RequestParam("token") String token) {
        TokenState result = userService.validateVerificationToken(token);
        switch (result) {
            case TokenValid:
                model.addAttribute("message", "Your account verified successfully!");
                return "verigooduser";
            case TokenInvalid:
                model.addAttribute("message", "Invalid token");
                break;
            case TokenExpired:
                model.addAttribute("message", "Your registration token has expired. Please register again.");
                model.addAttribute("expired", true);
                model.addAttribute("resendUrl",
                        Utils.constructBaseUrl(request) + "/api/auth/resendregistrationtoken?token=" + token);
        }
        return "veribaduser";
    }

    @GetMapping("/resendregistrationtoken")
    @ResponseBody
    @Operation(summary = "Resend registration token", description = "Resends a user's registration token. This is useful if the user did not receive the initial registration token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Re-sent registration token.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid token.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public ResponseEntity<?> resendRegistrationToken(HttpServletRequest request,
            @RequestParam("token") String existingToken) {
        VerificationToken newToken;
        try {
            newToken = userService.generateNewVerificationToken(existingToken);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid token"));
        }
        User user = userService.getUserByVerificationToken(newToken.getToken()).orElseThrow();
        SimpleMailMessage email = Utils.constructResendVerificationTokenEmail(request, newToken, user);
        mailSender.send(email);
        return ResponseEntity.ok(new MessageResponse("Re-sent registration token"));
    }

    @GetMapping("/forgotpassword")
    @ResponseBody
    @Operation(summary = "Forgot password", description = "This method is used to send a password reset email to the user. The user is not required to be logged in.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Send password recovery email.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) })
    })
    public ResponseEntity<?> forgotPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        Optional<User> rawUser = userService.findUserByEmail(userEmail);
        if (rawUser.isPresent()) {
            User user = rawUser.get();
            String myToken = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user, myToken);
            mailSender.send(Utils.constructResetTokenEmail(request, myToken, user));
        }
        return ResponseEntity.ok(new MessageResponse("You should receive an password reset email shortly."));
    }

    @GetMapping("/changeforgottenpassword")
    public String changeForgottenPassword(HttpServletRequest request, Model model,
            @RequestParam("token") String token) {
        TokenState result = securityUserService.validatePasswordResetToken(token);
        switch (result) {
            case TokenValid:
                model.addAttribute("token", token);
                model.addAttribute("submitUrl", Utils.constructBaseUrl(request) + "/api/auth/saveforgottenpassword");
                return "resetgooduser";
            case TokenInvalid:
                model.addAttribute("message", "Invalid token");
                break;
            case TokenExpired:
                model.addAttribute("message", "Your registration token has expired, please register again.");
        }
        return "resetbaduser";
    }

    @PostMapping("/saveforgottenpassword")
    @ResponseBody
    @Operation(summary = "Update forgotten password", description = "This method is used to save the new password for a user who has forgotten their password. The user is not required to be logged in.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Password successfully reset.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
            @ApiResponse(responseCode = "400", description = Constants.GENERIC_BAD_REQUEST, content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) }) })
    public ResponseEntity<?> savePassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        TokenState result = securityUserService.validatePasswordResetToken(resetPasswordRequest.getToken());
        switch (result) {
            case TokenInvalid:
                return ResponseEntity.badRequest().body("Invalid token");
            case TokenExpired:
                return ResponseEntity.badRequest().body("Your registration token has expired, please register again.");
            default:
                break;
        }
        User user = userService.getUserByPasswordResetToken(resetPasswordRequest.getToken()).orElseThrow();
        userService.changeUserPassword(user, resetPasswordRequest.getNewPassword());
        securityUserService.deletePasswordResetToken(resetPasswordRequest.getToken());
        return ResponseEntity.ok(new MessageResponse("Password reset successfully."));
    }
}
