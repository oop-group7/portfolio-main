package net.bestcompany.foliowatch.payload.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import net.bestcompany.foliowatch.models.DesiredStock;

@Getter
@Setter
public class PortfolioCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String strategy;

    @NotNull
    @Positive
    private Double capitalAmount;

    @NotNull
    private List<DesiredStock> desiredStocks;

    // @NotBlank
    // private String stockName;

    // @Positive
    // private double price;

    // @Positive
    // private int quantity;
}
