package net.bestcompany.foliowatch.payload.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
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

    @Positive
    private double capitalAmount;

    private List<DesiredStock> desiredStocks;

    // public List<DesiredStock> getDesiredStocks() {
    //     return desiredStocks;
    // }
    
    // public void setDesiredStocks(List<DesiredStock> desiredStocks) {
    //     this.desiredStocks = desiredStocks;
    // }

    // @NotBlank
    // private String stockName;

    // @Positive
    // private double price;

    // @Positive
    // private int quantity;
}
