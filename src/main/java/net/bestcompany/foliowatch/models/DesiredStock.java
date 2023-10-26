package net.bestcompany.foliowatch.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DesiredStock {
    @NotBlank
    private String stockName;

    @NotNull
    private double price;

    @NotNull
    private int quantity;

    @NotNull
    private Instant timestamp;
}
