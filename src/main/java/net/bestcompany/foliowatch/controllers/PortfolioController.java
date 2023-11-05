package net.bestcompany.foliowatch.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
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
import jakarta.mail.Message;
import jakarta.validation.Valid;
import net.bestcompany.foliowatch.models.Portfolio;
import net.bestcompany.foliowatch.models.User;
import net.bestcompany.foliowatch.payload.request.PortfolioCreateOrUpdateRequest;
import net.bestcompany.foliowatch.payload.response.AllPortfoliosResponse;
import net.bestcompany.foliowatch.payload.response.DoubleResponse;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.payload.response.StockNameResponse;
import net.bestcompany.foliowatch.security.services.IUserService;
import net.bestcompany.foliowatch.security.services.UserDetailsImpl;
import net.bestcompany.foliowatch.services.IPortfolioService;
import net.bestcompany.foliowatch.models.DesiredStock;

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
        public ResponseEntity<?> createPortfolio(@Valid @RequestBody PortfolioCreateOrUpdateRequest request) {
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
                portfolio.setCreatedAt(null);
                portfolioService.createPortfolio(portfolio);
                return ResponseEntity.status(201).body(new MessageResponse("Successfully created portfolio"));
        }

        @GetMapping("/getTotalCapitalAmount")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Get total amount of capital", description = "Retrieve total amount of capital.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieve total amount of capital.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = DoubleResponse.class)) })
        })
        public ResponseEntity<?> getTotalCapitalAmount() {
                User user = userService.findUserByEmail(
                                ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                                                .getPrincipal()).getEmail())
                                .orElseThrow();
                double totalCapitalStocks = 0.0;
                List<Portfolio> portfolios = portfolioService.getAllPortfoliosByUser(user);
                for (Portfolio portfolio : portfolios) {
                        totalCapitalStocks += portfolio.getCapitalAmount();
                }
                
                return ResponseEntity.ok().body(new DoubleResponse(totalCapitalStocks));
        }

        @GetMapping(value = "/getPercentageOfCapitalAllocated/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Get percentage of capital allocated for a portfolio", description = "Retrieve the percentage of capital allocated for the portfolio.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully calulated the percentage of capital allocated for a portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = StockNameResponse.class)) }),
                        @ApiResponse(responseCode = "404", description = "Unable to find portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
        })
        public ResponseEntity<?> getPercentageOfCapitalAllocated(@PathVariable String id) {
                Optional<Portfolio> rawPortfolio = portfolioService.findPortfolio(id);
                if (rawPortfolio.isPresent()) {
                        Portfolio portfolio = rawPortfolio.get();
                        double totalCapitalStocks = portfolio.getCapitalAmount();
                        List<DesiredStock> desiredStockList = portfolio.getDesiredStocks();
                        
                        Map<String, Double> groupByStockName = new HashMap<>();

                        for (DesiredStock stock: desiredStockList){
                                String stockName = stock.getStockName();
                                double totalPrice = stock.getPrice() * stock.getQuantity();
                                if (groupByStockName.containsKey(stockName)) {
                                        double updatedCapital = groupByStockName.get(stockName) + totalPrice;
                                        groupByStockName.put(stockName, updatedCapital);
                                }else {
                                        groupByStockName.put(stockName, totalPrice);
                                }
                        }
                        
                        double used = 0.0;
                        for (String stockName : groupByStockName.keySet()) {
                                double calculatePercentage = groupByStockName.get(stockName) / totalCapitalStocks * 100;
                                used += calculatePercentage;
                                groupByStockName.put(stockName, calculatePercentage);
                        }

                        if (used != 100.0){
                                double left = 100.0 - used;
                                groupByStockName.put("Left", left);
                        }
                        return ResponseEntity.ok().body(new StockNameResponse(groupByStockName));

                } else {
                        return ResponseEntity.status(404).body(new ErrorResponse("Unable to find portfolio"));
                }
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
        @Operation(summary = "Get a portfolio", description = "Retrieve a portfolio .")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieve portfolio.", content = {
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
                        @Valid @RequestBody PortfolioCreateOrUpdateRequest request) {
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
