package com.stocksense.dto;

import java.math.BigDecimal;

public class InventoryValueResponse {

    private BigDecimal totalInventoryValue;
    private BigDecimal deadStockValue;

    public InventoryValueResponse() {
    }

    public InventoryValueResponse(BigDecimal totalInventoryValue, BigDecimal deadStockValue) {
        this.totalInventoryValue = totalInventoryValue;
        this.deadStockValue = deadStockValue;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
    }

    public BigDecimal getDeadStockValue() {
        return deadStockValue;
    }

    public void setDeadStockValue(BigDecimal deadStockValue) {
        this.deadStockValue = deadStockValue;
    }
}
