package com.stocksense.service.impl;

import com.stocksense.dto.AlertSummaryResponse;
import com.stocksense.dto.InventoryAlertResponse;
import com.stocksense.entity.Product;
import com.stocksense.repository.ProductRepository;
import com.stocksense.service.InventoryAlertService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class InventoryAlertServiceImpl implements InventoryAlertService {

    private final ProductRepository productRepository;

    public InventoryAlertServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<InventoryAlertResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(product -> mapToAlertResponse(product, "LOW_STOCK", null))
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryAlertResponse> getExpiringSoonProducts() {
        LocalDate today = LocalDate.now();
        LocalDate todayPlus30 = today.plusDays(30);

        return productRepository.findByExpiryDateBetweenOrderByExpiryDateAsc(today, todayPlus30).stream()
                .map(product -> {
                    long daysRemaining = ChronoUnit.DAYS.between(today, product.getExpiryDate());
                    return mapToAlertResponse(product, "EXPIRING_SOON", Math.max(0L, daysRemaining));
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<InventoryAlertResponse> getExpiredProducts() {
        LocalDate today = LocalDate.now();

        return productRepository.findByExpiryDateBeforeOrderByExpiryDateAsc(today).stream()
                .map(product -> mapToAlertResponse(product, "EXPIRED", 0L))
                .collect(Collectors.toList());
    }

    @Override
    public AlertSummaryResponse getAlertSummary() {
        LocalDate today = LocalDate.now();
        LocalDate todayPlus30 = today.plusDays(30);

        long lowStockCount = productRepository.countLowStockProducts();
        long expiringSoonCount = productRepository.countByExpiryDateBetween(today, todayPlus30);
        long expiredCount = productRepository.countByExpiryDateBefore(today);

        return new AlertSummaryResponse(lowStockCount, expiringSoonCount, expiredCount);
    }

    private InventoryAlertResponse mapToAlertResponse(Product product, String alertType, Long daysRemaining) {
        return new InventoryAlertResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getQuantity(),
                product.getReorderLevel(),
                product.getExpiryDate(),
                alertType,
                daysRemaining
        );
    }
}
