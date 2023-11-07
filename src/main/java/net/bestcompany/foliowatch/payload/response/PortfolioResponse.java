package net.bestcompany.foliowatch.payload.response;

import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import net.bestcompany.foliowatch.models.DesiredStock;

@Getter
@Setter
@RequiredArgsConstructor
public class PortfolioResponse {
    @NotBlank
    private final String id;

    @NotBlank
    private final String name;

    @NotBlank
    private final String strategy;

    @NotNull
    private final double capitalAmount;

    @NotNull
    private final List<DesiredStock> desiredStocks;

    @NotNull
    private final double utilisedCapitalAmount;

    @NotNull
    private final Date createdAt;
}