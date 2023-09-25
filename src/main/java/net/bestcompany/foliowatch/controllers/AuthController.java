package net.bestcompany.foliowatch.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.models.ERole;
import net.bestcompany.foliowatch.models.Role;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.payload.request.LoginRequest;
import net.bestcompany.foliowatch.payload.request.ResetPasswordRequest;
import net.bestcompany.foliowatch.payload.request.SignupRequest;
import net.bestcompany.foliowatch.payload.response.JwtResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.payload.response.SignUpResponse;
import net.bestcompany.foliowatch.repository.RoleRepository;
import net.bestcompany.foliowatch.repository.UserRepository;
import net.bestcompany.foliowatch.security.jwt.JwtUtils;
import net.bestcompany.foliowatch.security.services.IRegistrationUserService;
import net.bestcompany.foliowatch.security.services.ISecurityUserService;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.TokenState;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.utils.Utils;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

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

    @PostMapping("/signin")
    @ResponseBody
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new JwtResponse(jwt, userDetails.getId(), userDetails.getFirstName(), userDetails.getEmail(), roles));
    }

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletRequest request) {
        try {
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
            }
            User user = new User(signUpRequest.getFirstName(), signUpRequest.getEmail(),
                    encoder.encode(signUpRequest.getPassword()));
            Set<String> strRoles = signUpRequest.getRoles();
            Set<Role> roles = new HashSet<>();
            if (strRoles == null) {
                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "dev":
                            Role devRole = roleRepository.findByName(ERole.ROLE_DEVELOPER)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(devRole);
                            break;
                        default:
                            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(userRole);
                    }
                });
            }
            user.setRoles(roles);
            userRepository.save(user);
            VerificationToken token = registrationUserService.sendRegistrationVerificationEmail(user, request);
            return ResponseEntity.ok(new SignUpResponse(token.getToken()));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error in Java mail configuration");
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
    public ResponseEntity<?> resendRegistrationToken(HttpServletRequest request,
            @RequestParam("token") String existingToken) {
        VerificationToken newToken;
        try {
            newToken = userService.generateNewVerificationToken(existingToken);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        User user = userService.getUserByVerificationToken(newToken.getToken()).orElseThrow();
        SimpleMailMessage email = Utils.constructResendVerificationTokenEmail(request, newToken, user);
        mailSender.send(email);
        return ResponseEntity.ok(new MessageResponse("Re-sent registration token"));
    }

    @GetMapping("/forgotpassword")
    @ResponseBody
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
        return ResponseEntity.ok("Password reset successfully.");
    }
}
