package com.stocksense.dto;

import com.stocksense.entity.TransactionType;

import java.time.LocalDateTime;

public class RecentTransactionResponse {

    private Long transactionId;
    private Long productId;
    private String productName;
    private String sku;
    private TransactionType type;
    private Integer quantity;
    private LocalDateTime transactionDate;
    private String performedByUsername;
    private String note;

    public RecentTransactionResponse() {
    }

    public RecentTransactionResponse(Long transactionId, Long productId, String productName, String sku,
                                     TransactionType type, Integer quantity, LocalDateTime transactionDate,
                                     String performedByUsername, String note) {
        this.transactionId = transactionId;
        this.productId = productId;
        this.productName = productName;
        this.sku = sku;
        this.type = type;
        this.quantity = quantity;
        this.transactionDate = transactionDate;
        this.performedByUsername = performedByUsername;
        this.note = note;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
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

    public String getPerformedByUsername() {
        return performedByUsername;
    }

    public void setPerformedByUsername(String performedByUsername) {
        this.performedByUsername = performedByUsername;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
