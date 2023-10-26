package net.bestcompany.foliowatch.externalapi.responses;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SearchTickerResponse {
    @NotNull
    private List<Match> bestMatches;

    @Getter
    public static class Match {
        @JsonAlias("1. symbol")
        @NotNull
        private String symbol;

        @JsonAlias("2. name")
        @NotNull
        private String name;

        @JsonAlias("3. type")
        @NotNull
        private String type;

        @JsonAlias("4. region")
        @NotNull
        private String region;

        @JsonAlias("5. marketOpen")
        @NotNull
        private String marketOpen;

        @JsonAlias("6. marketClose")
        @NotNull
        private String marketClose;

        @JsonAlias("7. timezone")
        @NotNull
        private String timezone;

        @JsonAlias("8. currency")
        @NotNull
        private String currency;

        @JsonAlias("9. matchScore")
        @NotNull
        private float matchScore;
    }
}
