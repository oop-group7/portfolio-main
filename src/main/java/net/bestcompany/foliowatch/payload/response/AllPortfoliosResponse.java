package net.bestcompany.foliowatch.payload.response;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class AllPortfoliosResponse {
    @NotBlank
    private final List<PortfolioResponse> portfolios;

    @NotBlank
    private final double utilisedCapitalAmount;
}
