package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.validators.Password;

@Getter
@Setter
public class UpdatePasswordRequest {
    @Password
    @NotBlank
    private String oldPassword;

    @Password
    @NotBlank
    private String newPassword;
}
