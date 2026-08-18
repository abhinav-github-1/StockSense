package com.stocksense.service;

import com.stocksense.dto.DashboardSummaryResponse;
import com.stocksense.dto.InventoryValueResponse;
import com.stocksense.dto.RecentTransactionResponse;
import com.stocksense.dto.StockStatusResponse;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getSummary();

    List<RecentTransactionResponse> getRecentTransactions();

    StockStatusResponse getStockStatus();

    InventoryValueResponse getInventoryValue();
}
