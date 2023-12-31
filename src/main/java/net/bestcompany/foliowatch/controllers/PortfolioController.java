package net.bestcompany.foliowatch.controllers;

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
import net.bestcompany.foliowatch.payload.request.PortfolioCreateRequest;
import net.bestcompany.foliowatch.payload.request.PortfolioUpdateRequest;
import net.bestcompany.foliowatch.payload.response.AllPortfoliosResponse;
import net.bestcompany.foliowatch.payload.response.ErrorResponse;
import net.bestcompany.foliowatch.payload.response.MessageResponse;
import net.bestcompany.foliowatch.payload.response.PortfolioResponse;
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
                        @ApiResponse(responseCode = "400", description = "Total utilised capital amount cannot be more than the total capital amount.", content = {
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
                portfolio.setStrategy(request.getStrategy());
                portfolio.setUser(user);
                portfolio.setDesiredStocks(request.getDesiredStocks());
                portfolio.setCreatedAt(null);
                try {
                        portfolioService.createPortfolio(portfolio);
                } catch (Exception e) {
                        return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
                }
                return ResponseEntity.status(201).body(new MessageResponse("Successfully created portfolio"));
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
                Optional<PortfolioResponse> rawPortfolio = portfolioService.findPortfolio(id);
                if (rawPortfolio.isPresent()) {
                        PortfolioResponse portfolio = rawPortfolio.get();
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
                AllPortfoliosResponse portfolios = portfolioService.getAllPortfoliosByUser(user);
                return ResponseEntity.ok().body(portfolios);
        }

        @GetMapping("/get/{id}")
        @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
        @Operation(summary = "Get a portfolio", description = "Retrieve a portfolio .")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieve portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = PortfolioResponse.class)) }),
                        @ApiResponse(responseCode = "404", description = "Unable to find portfolio.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
        })
        public ResponseEntity<?> getPortfolio(@PathVariable String id) {
                Optional<PortfolioResponse> rawPortfolio = portfolioService.findPortfolio(id);
                if (rawPortfolio.isPresent()) {
                        PortfolioResponse portfolio = rawPortfolio.get();
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
                        @ApiResponse(responseCode = "400", description = "Total utilised capital amount cannot be more than the total capital amount.", content = {
                                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class)) })
        })
        public ResponseEntity<?> updatePortfolio(@PathVariable String id,
                        @Valid @RequestBody PortfolioUpdateRequest request) {
                Optional<Portfolio> rawPortfolio = portfolioService.findPortfolioRaw(id);
                if (rawPortfolio.isPresent()) {
                        Portfolio prevPortfolio = rawPortfolio.get();
                        if (request.getCapitalAmount() != null) {
                                prevPortfolio.setCapitalAmount(request.getCapitalAmount());
                        }
                        if (request.getDesiredStocks() != null) {
                                prevPortfolio.setDesiredStocks(request.getDesiredStocks());
                        }
                        if (request.getName() != null) {
                                prevPortfolio.setName(request.getName());
                        }
                        if (request.getStrategy() != null) {
                                prevPortfolio.setStrategy(request.getStrategy());
                        }
                        try {
                                portfolioService.updatePortfolio(prevPortfolio);
                        } catch (Exception e) {
                                return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
                        }
                }
                return ResponseEntity.ok(new MessageResponse("Successfully updated portfolio"));
        }
}
