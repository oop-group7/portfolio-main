package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.validators.Password;

@Getter
@Setter
public class LoginRequest {
    @NotBlank
    private String email;

    @Password
    @NotBlank
    private String password;
}
