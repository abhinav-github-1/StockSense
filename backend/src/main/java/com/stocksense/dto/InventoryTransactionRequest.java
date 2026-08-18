package com.stocksense.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class InventoryTransactionRequest {

    @NotNull(message = "is required")
    private Long productId;

    @NotNull(message = "is required")
    @Min(value = 1, message = "must be greater than 0")
    private Integer quantity;

    @Size(max = 255, message = "must not exceed 255 characters")
    private String note;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
