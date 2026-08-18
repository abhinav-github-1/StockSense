package com.stocksense.service.impl;

import com.stocksense.dto.CategoryRequest;
import com.stocksense.dto.CategoryResponse;
import com.stocksense.entity.Category;
import com.stocksense.exception.ResourceConflictException;
import com.stocksense.exception.ResourceNotFoundException;
import com.stocksense.repository.CategoryRepository;
import com.stocksense.repository.ProductRepository;
import com.stocksense.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.getName().trim();
        if (categoryRepository.existsByName(name)) {
            throw new ResourceConflictException("Category name already exists");
        }

        Category category = new Category();
        category.setName(name);
        category.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String name = request.getName().trim();
        if (categoryRepository.existsByNameAndIdNot(name, id)) {
            throw new ResourceConflictException("Category name already exists");
        }

        category.setName(name);
        category.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (productRepository.existsByCategoryId(id)) {
            throw new ResourceConflictException("Cannot delete category because it is referenced by existing products");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt()
        );
    }
}
