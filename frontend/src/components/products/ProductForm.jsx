import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  suppliers = [],
  loading = false,
  errorMsg = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    supplierId: '',
    price: '',
    quantity: '',
    reorderLevel: '',
    expiryDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        categoryId: initialData.categoryId || '',
        supplierId: initialData.supplierId || '',
        price: initialData.price !== undefined ? initialData.price : '',
        quantity: initialData.quantity !== undefined ? initialData.quantity : '',
        reorderLevel: initialData.reorderLevel !== undefined ? initialData.reorderLevel : '',
        expiryDate: initialData.expiryDate ? initialData.expiryDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        categoryId: categories.length > 0 ? categories[0].id : '',
        supplierId: suppliers.length > 0 ? suppliers[0].id : '',
        price: '',
        quantity: '',
        reorderLevel: '',
        expiryDate: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories, suppliers]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.supplierId) {
      newErrors.supplierId = 'Please select a supplier';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Price must be a number greater than or equal to 0';
    }

    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a number greater than or equal to 0';
    }

    if (formData.reorderLevel === '' || isNaN(formData.reorderLevel) || Number(formData.reorderLevel) < 0) {
      newErrors.reorderLevel = 'Reorder level must be a number greater than or equal to 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      categoryId: Number(formData.categoryId),
      supplierId: Number(formData.supplierId),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      reorderLevel: Number(formData.reorderLevel),
      expiryDate: formData.expiryDate ? formData.expiryDate : null,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Product' : 'Add Product'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Ergonomic Mouse"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="sku">SKU Code *</label>
              <input
                id="sku"
                name="sku"
                type="text"
                className="form-input"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. MOUSE-WM-001"
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                className="form-input"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="supplierId">Supplier *</label>
              <select
                id="supplierId"
                name="supplierId"
                className="form-input"
                value={formData.supplierId}
                onChange={handleChange}
              >
                <option value="">-- Select Supplier --</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && <span className="field-error">{errors.supplierId}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                className="form-input"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
              />
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="reorderLevel">Reorder Level *</label>
              <input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                min="0"
                className="form-input"
                value={formData.reorderLevel}
                onChange={handleChange}
                placeholder="10"
              />
              {errors.reorderLevel && <span className="field-error">{errors.reorderLevel}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="expiryDate">Expiry Date (Optional)</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                className="form-input"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
