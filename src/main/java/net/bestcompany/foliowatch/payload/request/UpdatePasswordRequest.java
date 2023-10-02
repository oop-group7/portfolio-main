package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePasswordRequest {
    @NotBlank
    @Size(min = 8, max = 25)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,25}$", message = "Please ensure that your password is between 8-25 characters, has at least a symbol, a numeric character, and an upper and lowercase letter.")
    private String oldPassword;

    @NotBlank
    @Size(min = 8, max = 25)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d)(?=.*[@$!%*?&])[A-Za-z\\\\d@$!%*?&]{8,25}$", message = "Please ensure that your password is between 8-25 characters, has at least a symbol, a numeric character, and an upper and lowercase letter.")
    private String newPassword;
}
