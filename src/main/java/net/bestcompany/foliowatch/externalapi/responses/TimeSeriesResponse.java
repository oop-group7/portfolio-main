package net.bestcompany.foliowatch.externalapi.responses;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeSeriesResponse {
    @JsonAlias("Meta Data")
    private Metadata metadata;

    @JsonAlias("Time Series (Daily)")
    private Map<String, Series> timeSeries;

    @Getter
    @Setter
    public static class Metadata {
        @NotNull
        @JsonAlias("1. Information")
        private String information;

        @NotNull
        @JsonAlias("2. Symbol")
        private String symbol;

        @NotNull
        @JsonAlias("3. Last Refreshed")
        private String lastRefreshed;

        @NotNull
        @JsonAlias("4. Output Size")
        private String outputSize;

        @NotNull
        @JsonAlias("5. Time Zone")
        private String timezone;
    }

    @Getter
    @Setter
    public static class Series {
        @NotNull
        @JsonAlias("1. open")
        private String open;

        @NotNull
        @JsonAlias("2. high")
        private String high;

        @NotNull
        @JsonAlias("3. low")
        private String low;

        @NotNull
        @JsonAlias("4. close")
        private String close;

        @NotNull
        @JsonAlias("5. volume")
        private String volume;
    }
}
