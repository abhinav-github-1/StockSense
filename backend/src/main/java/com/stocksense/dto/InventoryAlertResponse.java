package com.stocksense.dto;

import java.time.LocalDate;

public class InventoryAlertResponse {

    private Long productId;
    private String productName;
    private String sku;
    private Integer quantity;
    private Integer reorderLevel;
    private LocalDate expiryDate;
    private String alertType;
    private Long daysRemaining;

    public InventoryAlertResponse() {
    }

    public InventoryAlertResponse(Long productId, String productName, String sku, Integer quantity,
                                  Integer reorderLevel, LocalDate expiryDate, String alertType, Long daysRemaining) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.quantity = quantity;
        this.reorderLevel = reorderLevel;
        this.expiryDate = expiryDate;
        this.alertType = alertType;
        this.daysRemaining = daysRemaining;
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public Long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(Long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }
}
