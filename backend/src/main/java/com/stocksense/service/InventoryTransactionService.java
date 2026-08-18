package com.stocksense.service;

import com.stocksense.dto.InventoryTransactionRequest;
import com.stocksense.dto.InventoryTransactionResponse;

import java.util.List;

public interface InventoryTransactionService {

    InventoryTransactionResponse createStockIn(InventoryTransactionRequest request);

    InventoryTransactionResponse createStockOut(InventoryTransactionRequest request);

    List<InventoryTransactionResponse> getAllTransactions();

    InventoryTransactionResponse getTransactionById(Long id);

    List<InventoryTransactionResponse> getTransactionsByProduct(Long productId);
}
