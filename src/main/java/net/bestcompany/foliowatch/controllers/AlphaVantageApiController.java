package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.bestcompany.foliowatch.exceptions.RetryException;
import net.bestcompany.foliowatch.externalapi.IAlphaVantageApi;
import net.bestcompany.foliowatch.externalapi.responses.SearchTickerResponse;
import net.bestcompany.foliowatch.externalapi.responses.TimeSeriesResponse;

@Controller
@RequestMapping("/api/alphaVantageApi")
@Tag(name = "AlphaVantage", description = "AlphaVantage APIs")
@SecurityRequirement(name = "bearerAuth")
@TimeLimiter(name = "api")
@Retry(name = "api", fallbackMethod = "handleCallNotPermittedException")
@CircuitBreaker(name = "api")
public class AlphaVantageApiController {
    @Autowired
    private IAlphaVantageApi apiService;

    @GetMapping("/dailytimeseries/{ticker}")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    @Operation(summary = "Get daily time series API", description = "Obtain Ddily time series data from AlphaVantage.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched API content.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = TimeSeriesResponse.class)) })
    })
    public ResponseEntity<?> getDailyTimeSeries(@PathVariable String ticker) {
        return ResponseEntity.ok().body(apiService.getTimeSeries(ticker));
    }

    @GetMapping("/searchticker/{keyword}")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    @Operation(summary = "Search ticker with provided keyword.", description = "Returns a list of tickers that match the given keyword.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched tickers.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = SearchTickerResponse.class)) })
    })
    public ResponseEntity<?> searchTickers(@PathVariable String keyword) {
        return ResponseEntity.ok().body(apiService.searchTicker(keyword));
    }

    public static void handleCallNotPermittedException() {
        throw new RetryException();
    }
}
