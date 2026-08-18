import api from './api';

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const getTransactionsByProduct = async (productId) => {
  const response = await api.get(`/transactions/product/${productId}`);
  return response.data;
};

export const stockIn = async (data) => {
  const response = await api.post('/transactions/stock-in', data);
  return response.data;
};

export const stockOut = async (data) => {
  const response = await api.post('/transactions/stock-out', data);
  return response.data;
};
