package com.stocksense.dto;

import java.math.BigDecimal;

public class DeadStockSummaryResponse {

    private long deadStockCount;
    private long deadStockQuantity;
    private BigDecimal deadStockValue;

    public DeadStockSummaryResponse() {
    }

    public DeadStockSummaryResponse(long deadStockCount, long deadStockQuantity, BigDecimal deadStockValue) {
        this.deadStockCount = deadStockCount;
        this.deadStockQuantity = deadStockQuantity;
        this.deadStockValue = deadStockValue;
    }

    public long getDeadStockCount() {
        return deadStockCount;
    }

    public void setDeadStockCount(long deadStockCount) {
        this.deadStockCount = deadStockCount;
    }

    public long getDeadStockQuantity() {
        return deadStockQuantity;
    }

    public void setDeadStockQuantity(long deadStockQuantity) {
        this.deadStockQuantity = deadStockQuantity;
    }

    public BigDecimal getDeadStockValue() {
        return deadStockValue;
    }

    public void setDeadStockValue(BigDecimal deadStockValue) {
        this.deadStockValue = deadStockValue;
    }
}
