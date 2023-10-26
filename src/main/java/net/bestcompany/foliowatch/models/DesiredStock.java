package net.bestcompany.foliowatch.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;

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
    @Positive
    private double price;

    @NotNull
    @Positive
    private int quantity;

    @CreatedDate
    private Date timestamp;
}
