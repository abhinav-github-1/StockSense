package com.stocksense.dto;

import com.stocksense.entity.TransactionType;

import java.time.LocalDateTime;

public class InventoryTransactionResponse {

    private Long id;
    private Long productId;
    private String productName;
    private TransactionType type;
    private Integer quantity;
    private LocalDateTime transactionDate;
    private String note;
    private Long performedByUserId;
    private String performedByUsername;

    public InventoryTransactionResponse() {
    }

    public InventoryTransactionResponse(Long id, Long productId, String productName, TransactionType type,
                                         Integer quantity, LocalDateTime transactionDate, String note,
                                         Long performedByUserId, String performedByUsername) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.type = type;
        this.quantity = quantity;
        this.transactionDate = transactionDate;
        this.note = note;
        this.performedByUserId = performedByUserId;
        this.performedByUsername = performedByUsername;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Long getPerformedByUserId() {
        return performedByUserId;
    }

    public void setPerformedByUserId(Long performedByUserId) {
        this.performedByUserId = performedByUserId;
    }

    public String getPerformedByUsername() {
        return performedByUsername;
    }

    public void setPerformedByUsername(String performedByUsername) {
        this.performedByUsername = performedByUsername;
    }
}
