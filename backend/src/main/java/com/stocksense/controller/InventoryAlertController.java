package com.stocksense.controller;

import com.stocksense.dto.AlertSummaryResponse;
import com.stocksense.dto.InventoryAlertResponse;
import com.stocksense.service.InventoryAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class InventoryAlertController {

    private final InventoryAlertService alertService;

    public InventoryAlertController(InventoryAlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<InventoryAlertResponse>> getLowStockProducts() {
        return ResponseEntity.ok(alertService.getLowStockProducts());
    }

    @GetMapping("/expiring-soon")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<InventoryAlertResponse>> getExpiringSoonProducts() {
        return ResponseEntity.ok(alertService.getExpiringSoonProducts());
    }

    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<InventoryAlertResponse>> getExpiredProducts() {
        return ResponseEntity.ok(alertService.getExpiredProducts());
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<AlertSummaryResponse> getAlertSummary() {
        return ResponseEntity.ok(alertService.getAlertSummary());
    }
}
