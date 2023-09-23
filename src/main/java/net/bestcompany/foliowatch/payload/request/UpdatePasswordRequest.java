package net.bestcompany.foliowatch.payload.request;

import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.validators.Password;

@Getter
@Setter
public class UpdatePasswordRequest {
    @Password
    private String oldPassword;

    @Password
    private String newPassword;
}
