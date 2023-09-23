package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.repository.UserRepository;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PostMapping("/updatepassword")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    public ResponseEntity<?> updatePassword(@RequestParam("password") String password,
            @RequestParam("oldpassword") String oldPassword) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        User user = userRepository.findByEmail(userDetails.getEmail()).get();
        if (!encoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid old password");
        }
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok("Successfully changed password");
    }
}
