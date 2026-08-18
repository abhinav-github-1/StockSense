package com.stocksense.controller;

import com.stocksense.dto.DashboardSummaryResponse;
import com.stocksense.dto.InventoryValueResponse;
import com.stocksense.dto.RecentTransactionResponse;
import com.stocksense.dto.StockStatusResponse;
import com.stocksense.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/recent-transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<RecentTransactionResponse>> getRecentTransactions() {
        return ResponseEntity.ok(dashboardService.getRecentTransactions());
    }

    @GetMapping("/stock-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<StockStatusResponse> getStockStatus() {
        return ResponseEntity.ok(dashboardService.getStockStatus());
    }

    @GetMapping("/inventory-value")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<InventoryValueResponse> getInventoryValue() {
        return ResponseEntity.ok(dashboardService.getInventoryValue());
    }
}
