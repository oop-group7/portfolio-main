package net.bestcompany.foliowatch.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.request.PortfolioCreateAndUpdateRequest;
import net.bestcompany.foliowatch.payload.response.AllPortfoliosResponse;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.services.IPortfolioService;

@RestController
@RequestMapping("/api/portfolio")
@Tag(name = "Portfolio", description = "Portfolio APIs")
@SecurityRequirement(name = "bearerAuth")
@TimeLimiter(name = "portfolioApi")
@Retry(name = "portfolioApi")
@CircuitBreaker(name = "portfolioApi")
public class PortfolioController {
        @Autowired
        private IPortfolioService portfolioService;

        @Autowired
        private IUserService userService;

        @PostMapping("/create")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Create portfolio", description = "Create new portfolio.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Successfully created portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
                        @ApiResponse(responseCode = "400", description = "One of the stock name provided is invalid.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
        })
        public ResponseEntity<?> createPortfolio(@Valid @RequestBody PortfolioCreateAndUpdateRequest request) {
                User user = userService.findUserByEmail(
                                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                                                .getPrincipal()).getEmail())
                                .orElseThrow();
                Portfolio portfolio = new Portfolio();
                portfolio.setCapitalAmount(request.getCapitalAmount());
                portfolio.setName(request.getName());
                portfolio.setStrategy(request.getStrategy());
                portfolio.setUser(user);
                portfolio.setDesiredStocks(request.getDesiredStocks());
                portfolioService.createPortfolio(portfolio);
                return ResponseEntity.status(201).body(new MessageResponse("Successfully created portfolio"));
        }

        @GetMapping("/getAll")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Get all portfolio", description = "Retrieve all portfolios by user.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieve all portfolios.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = AllPortfoliosResponse.class)) })
        })
        public ResponseEntity<?> getAllPortfolios() {
                User user = userService.findUserByEmail(
                                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                                                .getPrincipal()).getEmail())
                                .orElseThrow();
                List<Portfolio> portfolios = portfolioService.getAllPortfoliosByUser(user);
                return ResponseEntity.ok().body(new AllPortfoliosResponse(portfolios));
        }

        @GetMapping("/get/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Get all portfolio", description = "Retrieve all portfolios by user.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieve all portfolios.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = Portfolio.class)) }),
                        @ApiResponse(responseCode = "404", description = "Unable to find portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
        })
        public ResponseEntity<?> getPortfolio(@PathVariable String id) {
                Optional<Portfolio> rawPortfolio = portfolioService.findPortfolio(id);
                if (rawPortfolio.isPresent()) {
                        Portfolio portfolio = rawPortfolio.get();
                        return ResponseEntity.ok().body(portfolio);
                } else {
                        return ResponseEntity.status(404).body(new ErrorResponse("Unable to find portfolio"));
                }
        }

        @DeleteMapping("/deleteportfolio/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Delete portfolio", description = "Delete the portfolio.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully deleted portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) })
        })
        public ResponseEntity<?> deletePortfolio(@PathVariable String id) {
                portfolioService.deletePortfolio(id);
                return ResponseEntity.ok(new MessageResponse("Successfully deleted portfolio"));
        }

        @PutMapping("/updateportfolio/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Update portfolio", description = "Update the portfolio.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully updated portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) }),
                        @ApiResponse(responseCode = "404", description = "Unable to find portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class)) })
        })
        public ResponseEntity<?> updatePortfolio(@PathVariable String id,
                        @Valid @RequestBody PortfolioCreateAndUpdateRequest request) {
                Optional<Portfolio> rawPortfolio = portfolioService.findPortfolio(id);
                if (rawPortfolio.isPresent()) {
                        Portfolio prevPortfolio = rawPortfolio.get();
                        prevPortfolio.setCapitalAmount(request.getCapitalAmount());
                        prevPortfolio.setDesiredStocks(request.getDesiredStocks());
                        prevPortfolio.setName(request.getName());
                        prevPortfolio.setStrategy(request.getStrategy());
                        portfolioService.updatePortfolio(prevPortfolio);
                        return ResponseEntity.ok(new MessageResponse("Successfully updated portfolio"));
                } else {
                        return ResponseEntity.status(404).body(new MessageResponse("Portfolio does not exist"));
                }
        }
}
