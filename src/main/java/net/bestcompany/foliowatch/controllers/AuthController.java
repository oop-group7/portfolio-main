package net.bestcompany.foliowatch.controllers;

import java.util.Calendar;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.events.OnRegistrationCompleteEvent;
import net.bestcompany.foliowatch.events.Utils;
import net.bestcompany.foliowatch.models.ERole;
import net.bestcompany.foliowatch.models.PasswordResetToken;
import net.bestcompany.foliowatch.models.Role;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.models.VerificationToken;
import net.bestcompany.foliowatch.payload.request.LoginRequest;
import net.bestcompany.foliowatch.payload.request.ResetPasswordRequest;
import net.bestcompany.foliowatch.payload.request.SignupRequest;
import net.bestcompany.foliowatch.payload.response.JwtResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.repository.PasswordTokenRepository;
import net.bestcompany.foliowatch.repository.RoleRepository;
import net.bestcompany.foliowatch.repository.UserRepository;
import net.bestcompany.foliowatch.repository.VerificationTokenRepository;
import net.bestcompany.foliowatch.security.jwt.JwtUtils;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;

@Controller
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    ApplicationEventPublisher eventPublisher;

    @Autowired
    VerificationTokenRepository verificationTokenRepository;

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    PasswordTokenRepository passwordTokenRepository;

    @Autowired

    @PostMapping("/signin")
    @ResponseBody
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles));
    }

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest, HttpServletRequest request) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }
        User user = new User(signUpRequest.getUsername(), signUpRequest.getFirstName(), signUpRequest.getLastName(),
                signUpRequest.getEmail(),
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
        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(user, request));
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/registrationconfirm")
    public String confirmRegistration(HttpServletRequest request, Model model, @RequestParam("token") String token) {
        Optional<VerificationToken> rawVerificationToken = verificationTokenRepository.findByToken(token);
        if (rawVerificationToken.isEmpty()) {
            model.addAttribute("message", "Invalid token");
            return "veribaduser";
        }
        VerificationToken verificationToken = rawVerificationToken.get();
        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            model.addAttribute("message", "Your registration token has expired. Please register again.");
            model.addAttribute("expired", true);
            model.addAttribute("resendUrl",
                    Utils.constructBaseUrl(request) + "/api/auth/resendregistrationtoken?token=" + token);
            return "veribaduser";
        }
        user.setEnabled(true);
        userRepository.save(user);
        model.addAttribute("message", "Your account verified successfully!");
        return "verigooduser";
    }

    @GetMapping("/resendregistrationtoken")
    @ResponseBody
    public ResponseEntity<?> resendRegistrationToken(HttpServletRequest request,
            @RequestParam("token") String existingToken) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(existingToken).get();
        verificationToken.updateToken(UUID.randomUUID().toString());
        VerificationToken newToken = verificationTokenRepository.save(verificationToken);
        User user = verificationToken.getUser();
        SimpleMailMessage email = Utils.constructResendVerificationTokenEmail(request, newToken, user);
        mailSender.send(email);
        return ResponseEntity.ok(new MessageResponse("Re-sent registration token"));
    }

    @GetMapping("/resetpassword")
    @ResponseBody
    public ResponseEntity<?> resetPassword(HttpServletRequest request, @RequestParam("email") String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));
        String myToken = UUID.randomUUID().toString();
        PasswordResetToken token = new PasswordResetToken(myToken, user);
        passwordTokenRepository.save(token);
        mailSender.send(Utils.constructResetTokenEmail(request, token, user));
        return ResponseEntity.ok(new MessageResponse("You should receive an password reset email shortly."));
    }

    @GetMapping("/changepassword")
    public String showChangePasswordPage(Model model, @RequestParam("token") String token) {
        Optional<PasswordResetToken> rawPassToken = passwordTokenRepository.findByToken(token);
        if (rawPassToken.isEmpty()) {
            model.addAttribute("message", "Invalid token");
            return "resetbaduser";
        }
        PasswordResetToken passToken = rawPassToken.get();
        Calendar cal = Calendar.getInstance();
        if (passToken.getExpiryDate().before(cal.getTime())) {
            model.addAttribute("message", "Your registration token has expired, please register again.");
            return "resetbadduser";
        }
        model.addAttribute("token", token);
        return "resetgooduser";
    }

    @GetMapping("/savepassword")
    public ResponseEntity<?> savePassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        Optional<PasswordResetToken> rawPassToken = passwordTokenRepository
                .findByToken(resetPasswordRequest.getToken());
        if (rawPassToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        PasswordResetToken passToken = rawPassToken.get();
        Calendar cal = Calendar.getInstance();
        if (passToken.getExpiryDate().before(cal.getTime())) {
            return ResponseEntity.badRequest().body("Your registration token has expired, please register again.");
        }
        Optional<User> rawUser = passwordTokenRepository.findByToken(resetPasswordRequest.getToken())
                .map(token -> token.getUser());
        if (rawUser.isPresent()) {
            User user = rawUser.get();
            user.setPassword(encoder.encode(resetPasswordRequest.getNewPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("Password reset successfully.");
        } else {
            return ResponseEntity.badRequest().body("");
        }
    }
}
