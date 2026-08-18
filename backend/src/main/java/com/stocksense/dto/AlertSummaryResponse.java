package com.stocksense.dto;

public class AlertSummaryResponse {

    private long lowStockCount;
    private long expiringSoonCount;
    private long expiredCount;

    public AlertSummaryResponse() {
    }

    public AlertSummaryResponse(long lowStockCount, long expiringSoonCount, long expiredCount) {
        this.lowStockCount = lowStockCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getExpiringSoonCount() {
        return expiringSoonCount;
    }

    public void setExpiringSoonCount(long expiringSoonCount) {
        this.expiringSoonCount = expiringSoonCount;
    }

    public long getExpiredCount() {
        return expiredCount;
    }

    public void setExpiredCount(long expiredCount) {
        this.expiredCount = expiredCount;
    }
}
