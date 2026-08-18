package com.stocksense.service.impl;

import com.stocksense.dto.InventoryTransactionRequest;
import com.stocksense.dto.InventoryTransactionResponse;
import com.stocksense.entity.InventoryTransaction;
import com.stocksense.entity.Product;
import com.stocksense.entity.TransactionType;
import com.stocksense.entity.User;
import com.stocksense.exception.InsufficientStockException;
import com.stocksense.exception.ResourceNotFoundException;
import com.stocksense.repository.InventoryTransactionRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.UserRepository;
import com.stocksense.service.InventoryTransactionService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public InventoryTransactionServiceImpl(InventoryTransactionRepository transactionRepository,
                                           ProductRepository productRepository,
                                           UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public InventoryTransactionResponse createStockIn(InventoryTransactionRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        User currentUser = getCurrentUser();

        // 1. Increase product quantity
        product.setQuantity(product.getQuantity() + request.getQuantity());
        productRepository.save(product);

        // 2. Create and save transaction
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setProduct(product);
        transaction.setType(TransactionType.STOCK_IN);
        transaction.setQuantity(request.getQuantity());
        transaction.setNote(request.getNote() != null ? request.getNote().trim() : null);
        transaction.setUser(currentUser);

        InventoryTransaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    public InventoryTransactionResponse createStockOut(InventoryTransactionRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        if (request.getQuantity() > product.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock. Available quantity: " + product.getQuantity());
        }

        User currentUser = getCurrentUser();

        // 1. Decrease product quantity
        product.setQuantity(product.getQuantity() - request.getQuantity());
        productRepository.save(product);

        // 2. Create and save transaction
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setProduct(product);
        transaction.setType(TransactionType.STOCK_OUT);
        transaction.setQuantity(request.getQuantity());
        transaction.setNote(request.getNote() != null ? request.getNote().trim() : null);
        transaction.setUser(currentUser);

        InventoryTransaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InventoryTransactionResponse getTransactionById(Long id) {
        InventoryTransaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactionsByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return transactionRepository.findByProductIdOrderByTransactionDateDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new IllegalArgumentException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found with username: " + username));
    }

    private InventoryTransactionResponse mapToResponse(InventoryTransaction transaction) {
        return new InventoryTransactionResponse(
                transaction.getId(),
                transaction.getProduct() != null ? transaction.getProduct().getId() : null,
                transaction.getProduct() != null ? transaction.getProduct().getName() : null,
                transaction.getType(),
                transaction.getQuantity(),
                transaction.getTransactionDate(),
                transaction.getNote(),
                transaction.getUser() != null ? transaction.getUser().getId() : null,
                transaction.getUser() != null ? transaction.getUser().getUsername() : null
        );
    }
}
