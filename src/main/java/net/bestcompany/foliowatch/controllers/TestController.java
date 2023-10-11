package net.bestcompany.foliowatch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import io.swagger.v3.oas.annotations.Hidden;
import net.bestcompany.foliowatch.externalapi.responses.CatFact;
import net.bestcompany.foliowatch.externalapi.services.CatFactService;

@Hidden
@RestController
@RequestMapping("/api/test")
public class TestController {
    @Autowired
    private CatFactService catFactService;

    @GetMapping("/all")
    public String allAccess() {
        return "Public content";
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('DEVELOPER')")
    public String userAccess() {
        return "User content";
    }

    @GetMapping("/dev")
    @PreAuthorize("hasRole('DEVELOPER')")
    public String developerAccess() {
        return "Developer board";
    }

    @GetMapping("/test")
    @TimeLimiter(name = "catFactApi")
    @Retry(name = "catFactApi")
    @CircuitBreaker(name = "catFactApi")
    public ResponseEntity<?> test() {
        CatFact fact = catFactService.requestRandomFact();
        return ResponseEntity.ok(fact);
    }
}