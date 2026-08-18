package com.stocksense.service.impl;

import com.stocksense.dto.ReorderRecommendationResponse;
import com.stocksense.entity.Product;
import com.stocksense.repository.ProductRepository;
import com.stocksense.service.ReorderRecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReorderRecommendationServiceImpl implements ReorderRecommendationService {

    private final ProductRepository productRepository;

    public ReorderRecommendationServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ReorderRecommendationResponse> getRecommendations() {
        List<Product> lowStockProducts = productRepository.findLowStockProducts();

        return lowStockProducts.stream()
                .filter(product -> {
                    int targetStock = product.getReorderLevel() * 2;
                    int recommendedQty = targetStock - product.getQuantity();
                    return recommendedQty > 0;
                })
                .map(product -> {
                    int targetStock = product.getReorderLevel() * 2;
                    int recommendedQty = targetStock - product.getQuantity();
                    return new ReorderRecommendationResponse(
                            product.getId(),
                            product.getName(),
                            product.getSku(),
                            product.getQuantity(),
                            product.getReorderLevel(),
                            targetStock,
                            recommendedQty,
                            product.getSupplier() != null ? product.getSupplier().getId() : null,
                            product.getSupplier() != null ? product.getSupplier().getName() : null,
                            product.getExpiryDate()
                    );
                })
                .sorted(Comparator.comparing(ReorderRecommendationResponse::getCurrentQuantity)
                        .thenComparing(Comparator.comparing(ReorderRecommendationResponse::getRecommendedOrderQuantity).reversed()))
                .collect(Collectors.toList());
    }
}
