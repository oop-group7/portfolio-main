package net.bestcompany.foliowatch.payload.response;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class StockNameResponse {
    @NotBlank
    private final Map<String, Double> groupByStockName;
}
