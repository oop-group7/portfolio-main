package net.bestcompany.foliowatch.payload.response;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class TokenRefreshResponse {
    @NotBlank
    private final String accessToken;

    @NotBlank
    private final String refreshToken;

    @NotBlank
    private final String type = "Bearer";
}
