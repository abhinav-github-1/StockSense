package com.stocksense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProductRequest {

    @NotBlank(message = "is required")
    @Size(max = 100, message = "must not exceed 100 characters")
    private String name;

    @NotBlank(message = "is required")
    @Size(max = 50, message = "must not exceed 50 characters")
    private String sku;

    @NotNull(message = "is required")
    private Long categoryId;

    @NotNull(message = "is required")
    private Long supplierId;

    @NotNull(message = "is required")
    @DecimalMin(value = "0.0", message = "must be >= 0")
    private BigDecimal price;

    @NotNull(message = "is required")
    @Min(value = 0, message = "must be >= 0")
    private Integer quantity;

    @NotNull(message = "is required")
    @Min(value = 0, message = "must be >= 0")
    private Integer reorderLevel;

    private LocalDate expiryDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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
}
