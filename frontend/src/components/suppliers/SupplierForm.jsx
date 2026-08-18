import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SupplierForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
  errorMsg = '',
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
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
      newErrors.name = 'Supplier name is required';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Supplier' : 'Add Supplier'}</h2>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="supName">Supplier Name *</label>
            <input
              id="supName"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Acme Logistics Pvt Ltd"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="supEmail">Email (Optional)</label>
              <input
                id="supEmail"
                name="email"
                type="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@acme.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="supPhone">Phone (Optional)</label>
              <input
                id="supPhone"
                name="phone"
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="supAddress">Address (Optional)</label>
            <textarea
              id="supAddress"
              name="address"
              rows="3"
              className="form-input"
              style={{ resize: 'vertical' }}
              value={formData.address}
              onChange={handleChange}
              placeholder="Supplier physical or mailing address..."
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={loading}>
              {loading ? (initialData ? 'Updating...' : 'Saving...') : (initialData ? 'Update Supplier' : 'Save Supplier')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
