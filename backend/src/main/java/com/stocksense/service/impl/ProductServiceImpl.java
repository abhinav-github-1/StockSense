package com.stocksense.service.impl;

import com.stocksense.dto.ProductRequest;
import com.stocksense.dto.ProductResponse;
import com.stocksense.entity.Category;
import com.stocksense.entity.Product;
import com.stocksense.entity.Supplier;
import com.stocksense.exception.ResourceConflictException;
import com.stocksense.exception.ResourceNotFoundException;
import com.stocksense.repository.CategoryRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.SupplierRepository;
import com.stocksense.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                               CategoryRepository categoryRepository,
                               SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts(String search) {
        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchProducts(search.trim());
        } else {
            products = productRepository.findAll();
        }
        return products.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        String sku = request.getSku().trim();
        if (productRepository.existsBySku(sku)) {
            throw new ResourceConflictException("SKU already exists");
        }

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setSku(sku);
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setExpiryDate(request.getExpiryDate());

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        String sku = request.getSku().trim();
        if (productRepository.existsBySkuAndIdNot(sku, id)) {
            throw new ResourceConflictException("SKU already exists");
        }

        product.setName(request.getName().trim());
        product.setSku(sku);
        product.setCategory(category);
        product.setSupplier(supplier);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setReorderLevel(request.getReorderLevel());
        product.setExpiryDate(request.getExpiryDate());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getCategory() != null ? product.getCategory().getId() : null,
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getSupplier() != null ? product.getSupplier().getId() : null,
                product.getSupplier() != null ? product.getSupplier().getName() : null,
                product.getPrice(),
                product.getQuantity(),
                product.getReorderLevel(),
                product.getExpiryDate(),
                product.getCreatedAt()
        );
    }
}
