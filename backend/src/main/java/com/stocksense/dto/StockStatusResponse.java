package com.stocksense.dto;

public class StockStatusResponse {

    private long healthyStockCount;
    private long lowStockCount;
    private long outOfStockCount;

    public StockStatusResponse() {
    }

    public StockStatusResponse(long healthyStockCount, long lowStockCount, long outOfStockCount) {
        this.healthyStockCount = healthyStockCount;
        this.lowStockCount = lowStockCount;
        this.outOfStockCount = outOfStockCount;
    }

    public long getHealthyStockCount() {
        return healthyStockCount;
    }

    public void setHealthyStockCount(long healthyStockCount) {
        this.healthyStockCount = healthyStockCount;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getOutOfStockCount() {
        return outOfStockCount;
    }

    public void setOutOfStockCount(long outOfStockCount) {
        this.outOfStockCount = outOfStockCount;
    }
}
