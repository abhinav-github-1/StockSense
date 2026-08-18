import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  type = 'STOCK_IN', // 'STOCK_IN' or 'STOCK_OUT'
  products = [],
  preselectedProductId = '',
  loading = false,
  errorMsg = '',
}) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (preselectedProductId) {
        setProductId(preselectedProductId);
      } else if (products.length > 0) {
        setProductId(products[0].id);
      } else {
        setProductId('');
      }
      setQuantity('');
      setNote('');
      setErrors({});
    }
  }, [isOpen, preselectedProductId, products]);

  if (!isOpen) return null;

  const isStockIn = type === 'STOCK_IN';
  const selectedProduct = products.find((p) => String(p.id) === String(productId));

  const handleProductChange = (e) => {
    setProductId(e.target.value);
    setErrors((prev) => ({ ...prev, productId: '', quantity: '' }));
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setErrors((prev) => ({ ...prev, quantity: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!productId) {
      newErrors.productId = 'Please select a product';
    }

    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    } else if (!isStockIn && selectedProduct) {
      const requestedQty = Number(quantity);
      const availableQty = selectedProduct.quantity || 0;
      if (requestedQty > availableQty) {
        newErrors.quantity = `Insufficient stock. Available quantity: ${availableQty}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      productId: Number(productId),
      quantity: Number(quantity),
      note: note.trim(),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isStockIn ? (
              <ArrowUpRight size={22} className="text-green" />
            ) : (
              <ArrowDownLeft size={22} className="text-red" />
            )}
            <h2>{isStockIn ? 'Stock In' : 'Stock Out'}</h2>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="txProductId">Product *</label>
            <select
              id="txProductId"
              className="form-input"
              value={productId}
              onChange={handleProductChange}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.sku} — Stock: {p.quantity}
                </option>
              ))}
            </select>
            {errors.productId && <span className="field-error">{errors.productId}</span>}
          </div>

          {selectedProduct && (
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                padding: '0.6rem 0.8rem',
                borderRadius: '0.375rem',
                fontSize: '0.85rem',
                display: 'flex',
                justify健全: 'space-between',
                color: 'var(--text-muted)',
              }}
            >
              <span>Current Stock: <strong style={{ color: 'var(--text-main)' }}>{selectedProduct.quantity}</strong></span>
              {!isStockIn && (
                <span>Max Available: <strong style={{ color: 'var(--warning-color)' }}>{selectedProduct.quantity}</strong></span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="txQuantity">Quantity *</label>
            <input
              id="txQuantity"
              type="number"
              min="1"
              className="form-input"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="e.g. 10"
            />
            {errors.quantity && <span className="field-error">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="txNote">Note (Optional)</label>
            <input
              id="txNote"
              type="text"
              className="form-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isStockIn ? 'e.g. New supplier shipment' : 'e.g. Customer order dispatch'}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className={isStockIn ? 'btn-primary' : 'btn-danger'}
              style={{ width: 'auto' }}
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : isStockIn
                ? 'Add Stock'
                : 'Remove Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
