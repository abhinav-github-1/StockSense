package com.stocksense.controller;

import com.stocksense.dto.InventoryTransactionRequest;
import com.stocksense.dto.InventoryTransactionResponse;
import com.stocksense.service.InventoryTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    public InventoryTransactionController(InventoryTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/stock-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<InventoryTransactionResponse> createStockIn(@Valid @RequestBody InventoryTransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createStockIn(request));
    }

    @PostMapping("/stock-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<InventoryTransactionResponse> createStockOut(@Valid @RequestBody InventoryTransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createStockOut(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<InventoryTransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<InventoryTransactionResponse> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @GetMapping("/product/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<InventoryTransactionResponse>> getTransactionsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(transactionService.getTransactionsByProduct(productId));
    }
}
