package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.request.UpdatePasswordRequest;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.security.services.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserDetailsServiceImpl userService;

    @PostMapping("/updatepassword")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        User user = userService.findUserByEmail(
                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getEmail())
                .orElseThrow();
        if (!userService.checkIfValidOldPassword(user, updatePasswordRequest.getOldPassword())) {
            return ResponseEntity.badRequest().body("Invalid old password");
        }
        userService.changeUserPassword(user, updatePasswordRequest.getNewPassword());
        return ResponseEntity.ok("Successfully changed password");
    }
}
