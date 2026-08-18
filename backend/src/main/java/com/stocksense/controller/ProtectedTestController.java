package com.stocksense.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class ProtectedTestController {

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/protected")
    public Map<String, String> protectedEndpoint() {
        return Map.of("message", "authenticated");
    }
}
