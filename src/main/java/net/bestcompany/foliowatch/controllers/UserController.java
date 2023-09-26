package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.request.UpdatePasswordRequest;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User", description = "User APIs")
public class UserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/updatepassword")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    @Operation(summary = "Update user password", description = "Updates a user's password. If you are looking for the endpoint to update the password after a password reset request is sent, check the authentication controller docs.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully changed password.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Invalid old password.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        User user = userService.findUserByEmail(
                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getEmail())
                .orElseThrow();
        if (!userService.checkIfValidOldPassword(user, updatePasswordRequest.getOldPassword())) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid old password"));
        }
        userService.changeUserPassword(user, updatePasswordRequest.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Successfully changed password"));
    }
}
