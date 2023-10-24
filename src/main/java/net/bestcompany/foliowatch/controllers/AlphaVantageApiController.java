package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.crazzyghost.alphavantage.timeseries.response.TimeSeriesResponse;

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
import net.bestcompany.foliowatch.externalapi.AlphaVantageApi;
import net.bestcompany.foliowatch.externalapi.IAlphaVantageApi;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;

@Controller
@RequestMapping("/api/alphaVantageApi")
@Tag(name = "AlphaVantage", description = "AlphaVantage APIs")
@SecurityRequirement(name = "bearerAuth")
@TimeLimiter(name = "db")
@Retry(name = "db")
@CircuitBreaker(name = "db")
public class AlphaVantageApiController {
    @Autowired
    private IAlphaVantageApi apiService;

    @GetMapping("/dailyTimeSeries")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    @Operation(summary = "Create portfolio", description = "Create new portfolio.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created portfolio.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = TimeSeriesResponse.class)) })
    })
    public ResponseEntity<?> getDailyTimeSeries() {
        return ResponseEntity.ok().body(apiService.timeSeriesDaily());
    }
}
