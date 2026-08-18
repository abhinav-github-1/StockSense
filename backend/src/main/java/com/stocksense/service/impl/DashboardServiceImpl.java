package com.stocksense.service.impl;

import com.stocksense.dto.*;
import com.stocksense.entity.Product;
import com.stocksense.repository.CategoryRepository;
import com.stocksense.repository.InventoryTransactionRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.SupplierRepository;
import com.stocksense.service.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final InventoryAlertService alertService;
    private final ReorderRecommendationService reorderService;
    private final DeadStockService deadStockService;

    public DashboardServiceImpl(ProductRepository productRepository,
                                 CategoryRepository categoryRepository,
                                 SupplierRepository supplierRepository,
                                 InventoryTransactionRepository transactionRepository,
                                 InventoryAlertService alertService,
                                 ReorderRecommendationService reorderService,
                                 DeadStockService deadStockService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
        this.transactionRepository = transactionRepository;
        this.alertService = alertService;
        this.reorderService = reorderService;
        this.deadStockService = deadStockService;
    }

    @Override
    public DashboardSummaryResponse getSummary() {
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalSuppliers = supplierRepository.count();

        List<Product> products = productRepository.findAll();
        long totalInventoryQuantity = 0;
        BigDecimal totalInventoryValue = BigDecimal.ZERO;

        for (Product product : products) {
            int qty = product.getQuantity() != null ? product.getQuantity() : 0;
            BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            totalInventoryQuantity += qty;
            totalInventoryValue = totalInventoryValue.add(price.multiply(BigDecimal.valueOf(qty)));
        }

        AlertSummaryResponse alertSummary = alertService.getAlertSummary();
        DeadStockSummaryResponse deadStockSummary = deadStockService.getDeadStockSummary();
        long reorderCount = reorderService.getRecommendations().size();

        return new DashboardSummaryResponse(
                totalProducts,
                totalCategories,
                totalSuppliers,
                totalInventoryQuantity,
                totalInventoryValue,
                alertSummary.getLowStockCount(),
                alertSummary.getExpiringSoonCount(),
                alertSummary.getExpiredCount(),
                deadStockSummary.getDeadStockCount(),
                deadStockSummary.getDeadStockValue(),
                reorderCount
        );
    }

    @Override
    public List<RecentTransactionResponse> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByTransactionDateDesc().stream()
                .map(tx -> new RecentTransactionResponse(
                        tx.getId(),
                        tx.getProduct() != null ? tx.getProduct().getId() : null,
                        tx.getProduct() != null ? tx.getProduct().getName() : null,
                        tx.getProduct() != null ? tx.getProduct().getSku() : null,
                        tx.getType(),
                        tx.getQuantity(),
                        tx.getTransactionDate(),
                        tx.getUser() != null ? tx.getUser().getUsername() : null,
                        tx.getNote()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public StockStatusResponse getStockStatus() {
        List<Product> products = productRepository.findAll();
        long healthyStockCount = 0;
        long lowStockCount = 0;
        long outOfStockCount = 0;

        for (Product product : products) {
            int qty = product.getQuantity() != null ? product.getQuantity() : 0;
            int reorder = product.getReorderLevel() != null ? product.getReorderLevel() : 0;

            if (qty == 0) {
                outOfStockCount++;
            } else if (qty <= reorder) {
                lowStockCount++;
            } else {
                healthyStockCount++;
            }
        }

        return new StockStatusResponse(healthyStockCount, lowStockCount, outOfStockCount);
    }

    @Override
    public InventoryValueResponse getInventoryValue() {
        List<Product> products = productRepository.findAll();
        BigDecimal totalInventoryValue = BigDecimal.ZERO;

        for (Product product : products) {
            int qty = product.getQuantity() != null ? product.getQuantity() : 0;
            BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            totalInventoryValue = totalInventoryValue.add(price.multiply(BigDecimal.valueOf(qty)));
        }

        BigDecimal deadStockValue = deadStockService.getDeadStockSummary().getDeadStockValue();

        return new InventoryValueResponse(totalInventoryValue, deadStockValue);
    }
}
