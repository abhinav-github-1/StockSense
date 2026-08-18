package com.stocksense.repository;

import com.stocksense.entity.InventoryTransaction;
import com.stocksense.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    List<InventoryTransaction> findAllByOrderByTransactionDateDesc();

    List<InventoryTransaction> findTop10ByOrderByTransactionDateDesc();

    List<InventoryTransaction> findByProductIdOrderByTransactionDateDesc(Long productId);

    Optional<InventoryTransaction> findFirstByProductIdAndTypeOrderByTransactionDateDesc(Long productId, TransactionType type);
}
