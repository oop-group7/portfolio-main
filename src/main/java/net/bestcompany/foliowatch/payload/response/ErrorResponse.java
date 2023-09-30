package net.bestcompany.foliowatch.payload.response;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class ErrorResponse {
    @NotBlank
    private final String error;
}
