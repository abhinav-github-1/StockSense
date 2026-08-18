package com.stocksense.service.impl;

import com.stocksense.dto.SupplierRequest;
import com.stocksense.dto.SupplierResponse;
import com.stocksense.entity.Supplier;
import com.stocksense.exception.ResourceConflictException;
import com.stocksense.exception.ResourceNotFoundException;
import com.stocksense.repository.ProductRepository;
import com.stocksense.repository.SupplierRepository;
import com.stocksense.service.SupplierService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository, ProductRepository productRepository) {
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponse> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
        return mapToResponse(supplier);
    }

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        Supplier supplier = new Supplier();
        supplier.setName(request.getName().trim());
        supplier.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim() : null);
        supplier.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        supplier.setAddress(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : null);

        Supplier savedSupplier = supplierRepository.save(supplier);
        return mapToResponse(savedSupplier);
    }

    @Override
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        supplier.setName(request.getName().trim());
        supplier.setEmail(request.getEmail() != null && !request.getEmail().trim().isEmpty() ? request.getEmail().trim() : null);
        supplier.setPhone(request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : null);
        supplier.setAddress(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : null);

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToResponse(updatedSupplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        if (productRepository.existsBySupplierId(id)) {
            throw new ResourceConflictException("Cannot delete supplier because it is referenced by existing products");
        }

        supplierRepository.delete(supplier);
    }

    private SupplierResponse mapToResponse(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getCreatedAt()
        );
    }
}
