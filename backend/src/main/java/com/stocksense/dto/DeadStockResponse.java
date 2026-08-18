package com.stocksense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DeadStockResponse {

    private Long productId;
    private String productName;
    private String sku;
    private Integer currentQuantity;
    private Integer reorderLevel;
    private Long supplierId;
    private String supplierName;
    private LocalDate lastStockOutDate;
    private Long daysSinceLastStockOut;
    private BigDecimal inventoryValue;

    public DeadStockResponse() {
    }

    public DeadStockResponse(Long productId, String productName, String sku, Integer currentQuantity,
                             Integer reorderLevel, Long supplierId, String supplierName,
                             LocalDate lastStockOutDate, Long daysSinceLastStockOut, BigDecimal inventoryValue) {
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.currentQuantity = currentQuantity;
        this.reorderLevel = reorderLevel;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.lastStockOutDate = lastStockOutDate;
        this.daysSinceLastStockOut = daysSinceLastStockOut;
        this.inventoryValue = inventoryValue;
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

    public LocalDate getLastStockOutDate() {
        return lastStockOutDate;
    }

    public void setLastStockOutDate(LocalDate lastStockOutDate) {
        this.lastStockOutDate = lastStockOutDate;
    }

    public Long getDaysSinceLastStockOut() {
        return daysSinceLastStockOut;
    }

    public void setDaysSinceLastStockOut(Long daysSinceLastStockOut) {
        this.daysSinceLastStockOut = daysSinceLastStockOut;
    }

    public BigDecimal getInventoryValue() {
        return inventoryValue;
    }

    public void setInventoryValue(BigDecimal inventoryValue) {
        this.inventoryValue = inventoryValue;
    }
}
