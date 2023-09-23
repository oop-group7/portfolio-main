package net.bestcompany.foliowatch.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
