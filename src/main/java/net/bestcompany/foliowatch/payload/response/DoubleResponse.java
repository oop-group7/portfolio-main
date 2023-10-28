package net.bestcompany.foliowatch.payload.response;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class DoubleResponse {
    @NotBlank
    private final Double Amount;
}
