package net.bestcompany.foliowatch.payload.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.models.DesiredStock;

@Getter
@Setter
public class PortfolioCreateAndUpdateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String strategy;

    @NotNull
    @Positive
    private Double capitalAmount;

    @NotNull
    @Valid
    private List<DesiredStock> desiredStocks;
}
