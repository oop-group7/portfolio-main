package net.bestcompany.foliowatch.payload.response;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class JwtResponse {
    @NotBlank
    private final String accessToken;

    @NotBlank
    private final String type = "Bearer";

    @NotBlank
    private final String id;

    @NotBlank
    private final String firstName;

    @NotBlank
    private final String email;

    @NotBlank
    private final List<String> roles;

    @NotBlank
    private final String refreshToken;
}
