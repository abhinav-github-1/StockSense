package com.stocksense.dto;

import java.time.LocalDate;

public class ReorderRecommendationResponse {

    private Long productId;
    private String productName;
    private String sku;
    private Integer currentQuantity;
    private Integer reorderLevel;
    private Integer targetStock;
    private Integer recommendedOrderQuantity;
    private Long supplierId;
    private String supplierName;
    private LocalDate expiryDate;

    public ReorderRecommendationResponse() {
    }

    public ReorderRecommendationResponse(Long productId, String productName, String sku, Integer currentQuantity,
                                         Integer reorderLevel, Integer targetStock, Integer recommendedOrderQuantity,
                                         Long supplierId, String supplierName, LocalDate expiryDate) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.currentQuantity = currentQuantity;
        this.reorderLevel = reorderLevel;
        this.targetStock = targetStock;
        this.recommendedOrderQuantity = recommendedOrderQuantity;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.expiryDate = expiryDate;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Integer getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(Integer currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Integer getTargetStock() {
        return targetStock;
    }

    public void setTargetStock(Integer targetStock) {
        this.targetStock = targetStock;
    }

    public Integer getRecommendedOrderQuantity() {
        return recommendedOrderQuantity;
    }

    public void setRecommendedOrderQuantity(Integer recommendedOrderQuantity) {
        this.recommendedOrderQuantity = recommendedOrderQuantity;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
}
