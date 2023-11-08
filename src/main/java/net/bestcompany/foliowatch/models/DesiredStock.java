package net.bestcompany.foliowatch.models;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

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
    private String symbol;

    @NotBlank
    private String stockName;

    @NotNull
    @Positive
    private Double price;

    @NotNull
    private Integer quantity;

    @CreatedDate
    private Date timestamp;
}
