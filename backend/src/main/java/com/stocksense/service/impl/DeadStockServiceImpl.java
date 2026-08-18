package com.stocksense.service.impl;

import com.stocksense.dto.DeadStockResponse;
import com.stocksense.dto.DeadStockSummaryResponse;
import com.stocksense.entity.InventoryTransaction;
import com.stocksense.entity.Product;
import com.stocksense.entity.TransactionType;
import com.stocksense.repository.InventoryTransactionRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.service.DeadStockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class DeadStockServiceImpl implements DeadStockService {

    private final ProductRepository productRepository;
    private final InventoryTransactionRepository transactionRepository;

    public DeadStockServiceImpl(ProductRepository productRepository,
                                InventoryTransactionRepository transactionRepository) {
        this.productRepository = productRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public List<DeadStockResponse> getDeadStockProducts() {
        LocalDate today = LocalDate.now();
        List<Product> availableProducts = productRepository.findByQuantityGreaterThan(0);
        List<DeadStockResponse> deadStockList = new ArrayList<>();

        for (Product product : availableProducts) {
            Optional<InventoryTransaction> lastStockOut = transactionRepository
                    .findFirstByProductIdAndTypeOrderByTransactionDateDesc(product.getId(), TransactionType.STOCK_OUT);

            LocalDate referenceDate;
            LocalDate lastStockOutDate = null;

            if (lastStockOut.isPresent()) {
                lastStockOutDate = lastStockOut.get().getTransactionDate().toLocalDate();
                referenceDate = lastStockOutDate;
            } else if (product.getCreatedAt() != null) {
                referenceDate = product.getCreatedAt().toLocalDate();
            } else {
                referenceDate = today;
            }

            long daysSince = ChronoUnit.DAYS.between(referenceDate, today);

            if (daysSince >= 60) {
                BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
                BigDecimal inventoryValue = price.multiply(BigDecimal.valueOf(product.getQuantity()));

                DeadStockResponse response = new DeadStockResponse(
                        product.getId(),
                        product.getName(),
                        product.getSku(),
                        product.getQuantity(),
                        product.getReorderLevel(),
                        product.getSupplier() != null ? product.getSupplier().getId() : null,
                        product.getSupplier() != null ? product.getSupplier().getName() : null,
                        lastStockOutDate,
                        daysSince,
                        inventoryValue
                );
                deadStockList.add(response);
            }
        }

        deadStockList.sort(Comparator
                .comparing(DeadStockResponse::getDaysSinceLastStockOut, Comparator.reverseOrder())
                .thenComparing(DeadStockResponse::getInventoryValue, Comparator.reverseOrder()));

        return deadStockList;
    }

    @Override
    public DeadStockSummaryResponse getDeadStockSummary() {
        List<DeadStockResponse> deadStockProducts = getDeadStockProducts();

        long count = deadStockProducts.size();
        long totalQuantity = deadStockProducts.stream()
                .mapToLong(DeadStockResponse::getCurrentQuantity)
                .sum();
        BigDecimal totalValue = deadStockProducts.stream()
                .map(DeadStockResponse::getInventoryValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DeadStockSummaryResponse(count, totalQuantity, totalValue);
    }
}
