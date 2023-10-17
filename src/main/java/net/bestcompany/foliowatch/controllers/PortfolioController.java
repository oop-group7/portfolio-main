package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.externalapi.IAlphaVantageApi;
import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.request.PortfolioCreateRequest;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.services.IportfolioService;

@RestController
@RequestMapping("/api/portfolio")
@Tag(name = "Portfolio", description = "Portfolio APIs")
@SecurityRequirement(name = "bearerAuth")
@TimeLimiter(name = "portfolioApi")
@Retry(name = "portfolioApi")
@CircuitBreaker(name = "portfolioApi")
public class PortfolioController {
    @Autowired
    private IAlphaVantageApi apiService;

    @Autowired
    private IportfolioService portfolioService;

    @Autowired
    private IUserService userService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    @Operation(summary = "Create portfolio", description = "Create new portfolio.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Successfully created portfolio.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Portfolio already exists, name must be unique.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
    })
    public ResponseEntity<?> createPortfolio(@Valid @RequestBody PortfolioCreateRequest request) {
        User user = userService.findUserByEmail(
                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                        .getPrincipal()).getEmail())
                .orElseThrow();
        Portfolio portfolio = new Portfolio();
        portfolio.setCapitalAmount(request.getCapitalAmount());
        portfolio.setName(request.getName());
        portfolio.setPrice(request.getPrice());
        portfolio.setQuantity(request.getQuantity());
        portfolio.setStockName(request.getStockName());
        portfolio.setStrategy(request.getStrategy());
        portfolio.setUser(user);
        try {
            portfolioService.createPortfolio(portfolio);
            return ResponseEntity.status(201).body(new MessageResponse("Successfully created portfolio"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
