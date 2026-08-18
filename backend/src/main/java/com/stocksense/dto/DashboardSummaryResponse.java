package com.stocksense.dto;

import java.math.BigDecimal;

public class DashboardSummaryResponse {

    private long totalProducts;
    private long totalCategories;
    private long totalSuppliers;
    private long totalInventoryQuantity;
    private BigDecimal totalInventoryValue;
    private long lowStockCount;
    private long expiringSoonCount;
    private long expiredCount;
    private long deadStockCount;
    private BigDecimal deadStockValue;
    private long reorderRecommendationCount;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(long totalProducts, long totalCategories, long totalSuppliers,
                                    long totalInventoryQuantity, BigDecimal totalInventoryValue,
                                    long lowStockCount, long expiringSoonCount, long expiredCount,
                                    long deadStockCount, BigDecimal deadStockValue,
                                    long reorderRecommendationCount) {
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalSuppliers = totalSuppliers;
        this.totalInventoryQuantity = totalInventoryQuantity;
        this.totalInventoryValue = totalInventoryValue;
        this.lowStockCount = lowStockCount;
        this.expiringSoonCount = expiringSoonCount;
        this.expiredCount = expiredCount;
        this.deadStockCount = deadStockCount;
        this.deadStockValue = deadStockValue;
        this.reorderRecommendationCount = reorderRecommendationCount;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public long getTotalInventoryQuantity() {
        return totalInventoryQuantity;
    }

    public void setTotalInventoryQuantity(long totalInventoryQuantity) {
        this.totalInventoryQuantity = totalInventoryQuantity;
    }

    public BigDecimal getTotalInventoryValue() {
        return totalInventoryValue;
    }

    public void setTotalInventoryValue(BigDecimal totalInventoryValue) {
        this.totalInventoryValue = totalInventoryValue;
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

    public long getDeadStockCount() {
        return deadStockCount;
    }

    public void setDeadStockCount(long deadStockCount) {
        this.deadStockCount = deadStockCount;
    }

    public BigDecimal getDeadStockValue() {
        return deadStockValue;
    }

    public void setDeadStockValue(BigDecimal deadStockValue) {
        this.deadStockValue = deadStockValue;
    }

    public long getReorderRecommendationCount() {
        return reorderRecommendationCount;
    }

    public void setReorderRecommendationCount(long reorderRecommendationCount) {
        this.reorderRecommendationCount = reorderRecommendationCount;
    }
}
