package net.bestcompany.foliowatch.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Hidden;

@Hidden
@RestController
@RequestMapping("/api/test")
public class TestController {
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
}