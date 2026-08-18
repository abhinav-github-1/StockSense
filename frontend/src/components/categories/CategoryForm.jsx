import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  errorMsg = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

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
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Category' : 'Add Category'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="catName">Category Name *</label>
            <input
              id="catName"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics, Pharmaceuticals"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="catDesc">Description (Optional)</label>
            <textarea
              id="catDesc"
              name="description"
              rows="3"
              className="form-input"
              style={{ resize: 'vertical' }}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the category..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Category' : 'Save Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
