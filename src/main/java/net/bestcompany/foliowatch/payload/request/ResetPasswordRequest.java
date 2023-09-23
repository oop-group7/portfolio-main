package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.validators.Password;

@Getter
@Setter
public class ResetPasswordRequest {
    @Password
    private String oldPassword;

    @NotBlank
    private String token;

    @Password
    private String newPassword;
}
