package net.bestcompany.foliowatch.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "portfolios")
@Getter
@Setter
@NoArgsConstructor
public class Portfolio {
    private @Id @Setter(AccessLevel.PROTECTED) String id;

    @DBRef
    @NotNull
    private User user;

    @NotBlank
    private String name;

    @NotBlank
    private String strategy;

    @NotNull
    private double capitalAmount;

    @NotNull
    private List<DesiredStock> desiredStocks;

    // @NotBlank
    // private String stockName;

    // @NotBlank
    // private double price;

    // @NotBlank
    // private int quantity;
}
