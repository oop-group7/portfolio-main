package net.bestcompany.foliowatch.externalapi;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import net.bestcompany.foliowatch.exceptions.APIRateLimitException;
import net.bestcompany.foliowatch.externalapi.responses.SearchTickerResponse;
import net.bestcompany.foliowatch.externalapi.responses.TimeSeriesResponse;
import reactor.netty.http.client.HttpClient;

@Service
public class AlphaVantageApi implements IAlphaVantageApi {
        @Value("${foliowatch.app.alphaVantageApiKey}")
        private String apiKey;

        private final String BASE_URL = "https://www.alphavantage.co/query";

        private final WebClient client = WebClient.builder()
                        .clientConnector(
                                        new ReactorClientHttpConnector(
                                                        HttpClient.create()
                                                                        .responseTimeout(Duration.ofSeconds(9))))
                        .build();

        @Override
        @Cacheable("searchSymbol")
        public SearchTickerResponse searchTicker(String keyword) {
                var result = client.get()
                                .uri(BASE_URL, uriBuilder -> uriBuilder
                                                .queryParam( "function", "SYMBOL_SEARCH")
                                                .queryParam("keywords", keyword)
                                                .queryParam("apikey", apiKey).build())
                                .retrieve()
                                .bodyToMono(SearchTickerResponse.class).block();
                if (result.getBestMatches() == null) {
                        throw new APIRateLimitException();
                }
                return result;
        }

        @Override
        @Cacheable("timeSeries")
        public TimeSeriesResponse getTimeSeries(String ticker) {
                var result = client.get()
                                .uri(BASE_URL,
                                                uriBuilder -> uriBuilder.queryParam("function", "TIME_SERIES_DAILY")
                                                                .queryParam("symbol", ticker)
                                                                .queryParam("apikey", apiKey).build())
                                .retrieve().bodyToMono(TimeSeriesResponse.class).block();
                if (result.getMetadata() == null) {
                        throw new APIRateLimitException();
                }
                return result;
        }

        @Override
        @Cacheable("tickerExists")
        public boolean tickerExists(String ticker) {
                SearchTickerResponse response = searchTicker(ticker);
                return response.getBestMatches().stream().anyMatch(t -> t.getName().equals(ticker));
        }
}
