package net.bestcompany.foliowatch.externalapi.responses;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatFact {
    private String fact;
}
