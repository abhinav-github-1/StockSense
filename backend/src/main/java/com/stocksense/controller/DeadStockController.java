package com.stocksense.controller;

import com.stocksense.dto.DeadStockResponse;
import com.stocksense.dto.DeadStockSummaryResponse;
import com.stocksense.service.DeadStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/dead-stock")
public class DeadStockController {

    private final DeadStockService deadStockService;

    public DeadStockController(DeadStockService deadStockService) {
        this.deadStockService = deadStockService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<DeadStockResponse>> getDeadStockProducts() {
        return ResponseEntity.ok(deadStockService.getDeadStockProducts());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<DeadStockSummaryResponse> getDeadStockSummary() {
        return ResponseEntity.ok(deadStockService.getDeadStockSummary());
    }
}
