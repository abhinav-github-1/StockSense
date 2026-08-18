package com.stocksense.service;

import com.stocksense.dto.AlertSummaryResponse;
import com.stocksense.dto.InventoryAlertResponse;

import java.util.List;

public interface InventoryAlertService {

    List<InventoryAlertResponse> getLowStockProducts();

    List<InventoryAlertResponse> getExpiringSoonProducts();

    List<InventoryAlertResponse> getExpiredProducts();

    AlertSummaryResponse getAlertSummary();
}
