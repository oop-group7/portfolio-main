package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.validators.Password;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank
    private String token;

    @Password
    @NotBlank
    private String newPassword;
}
