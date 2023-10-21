package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String strategy;

    @Positive
    private double capitalAmount;

    @NotBlank
    private String stockName;

    @Positive
    private double price;

    @Positive
    private int quantity;
}
