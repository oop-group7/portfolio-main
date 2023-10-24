package net.bestcompany.foliowatch.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

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

    @Positive
    private double price;

    @Positive
    private int quantity;

    private Instant timestamp;
}
