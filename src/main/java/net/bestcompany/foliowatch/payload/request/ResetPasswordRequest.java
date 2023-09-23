package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import net.bestcompany.foliowatch.validators.Password;

public class ResetPasswordRequest {
    @NotBlank
    private String oldPassword;

    @NotBlank
    private String token;

    @Password
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getToken() {
        return oldPassword;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
