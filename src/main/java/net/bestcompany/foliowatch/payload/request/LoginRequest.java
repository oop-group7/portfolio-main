package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import net.bestcompany.foliowatch.validators.Password;

public class LoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Password
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
