package net.bestcompany.foliowatch.payload.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.models.DesiredStock;

@Getter
@Setter
public class PortfolioUpdateRequest {
    private String name;

    private String strategy;

    @Positive
    private Double capitalAmount;

    @Valid
    private List<DesiredStock> desiredStocks;
}
