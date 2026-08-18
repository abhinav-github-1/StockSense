package com.stocksense.service;

import com.stocksense.dto.DeadStockResponse;
import com.stocksense.dto.DeadStockSummaryResponse;

import java.util.List;

public interface DeadStockService {

    List<DeadStockResponse> getDeadStockProducts();

    DeadStockSummaryResponse getDeadStockSummary();
}
