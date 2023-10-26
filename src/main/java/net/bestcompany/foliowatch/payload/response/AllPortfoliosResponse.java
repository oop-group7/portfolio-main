package net.bestcompany.foliowatch.payload.response;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import net.bestcompany.foliowatch.models.Portfolio;

@Getter
@Setter
@RequiredArgsConstructor
public class AllPortfoliosResponse {
    @NotBlank
    private final List<Portfolio> portfolios;
}
