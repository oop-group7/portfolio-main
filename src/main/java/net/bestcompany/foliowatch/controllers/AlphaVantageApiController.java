package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.crazzyghost.alphavantage.timeseries.response.TimeSeriesResponse;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.bestcompany.foliowatch.externalapi.AlphaVantageApi;

@Controller
@RequestMapping("/api/alphaVantageApi")
@Tag(name = "AlphaVantage", description = "AlphaVantage APIs")
@SecurityRequirement(name = "bearerAuth")
@SecurityRequirement(name = "bearerAuth")
@TimeLimiter(name = "db")
@Retry(name = "db")
@CircuitBreaker(name = "db")
public class AlphaVantageApiController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AlphaVantageApi alphaVantageApi;

    @GetMapping("/dailyTimeSeries")
    public TimeSeriesResponse getDailyTimeSeries() {
        return alphaVantageApi.timeSeriesDaily();
    }
}
