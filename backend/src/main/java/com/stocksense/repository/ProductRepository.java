package com.stocksense.repository;

import com.stocksense.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    boolean existsByCategoryId(Long categoryId);

    boolean existsBySupplierId(Long supplierId);

    List<Product> findByQuantityGreaterThan(Integer quantity);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Product> searchProducts(@Param("search") String search);

    @Query("SELECT p FROM Product p WHERE p.quantity <= p.reorderLevel ORDER BY p.quantity ASC")
    List<Product> findLowStockProducts();

    List<Product> findByExpiryDateBetweenOrderByExpiryDateAsc(LocalDate startDate, LocalDate endDate);

    List<Product> findByExpiryDateBeforeOrderByExpiryDateAsc(LocalDate today);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity <= p.reorderLevel")
    long countLowStockProducts();

    long countByExpiryDateBetween(LocalDate startDate, LocalDate endDate);

    long countByExpiryDateBefore(LocalDate today);
}
