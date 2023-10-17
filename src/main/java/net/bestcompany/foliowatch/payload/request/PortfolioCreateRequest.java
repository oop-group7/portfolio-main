package net.bestcompany.foliowatch.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PortfolioCreateRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String strategy;

    @NotBlank
    private double capitalAmount;

    @NotBlank
    private String stockName;

    @NotBlank
    private double price;

    @NotBlank
    private int quantity;
}
