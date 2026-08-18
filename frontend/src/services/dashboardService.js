import api from './api';

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

export const getRecentTransactions = async () => {
  const response = await api.get('/dashboard/recent-transactions');
  return response.data;
};

export const getStockStatus = async () => {
  const response = await api.get('/dashboard/stock-status');
  return response.data;
};

export const getInventoryValue = async () => {
  const response = await api.get('/dashboard/inventory-value');
  return response.data;
};

export const getExpiringSoonProducts = async () => {
  const response = await api.get('/alerts/expiring-soon');
  return response.data;
};

export const getExpiredProducts = async () => {
  const response = await api.get('/alerts/expired');
  return response.data;
};

export const getReorderRecommendations = async () => {
  const response = await api.get('/reorder/recommendations');
  return response.data;
};

export const getDeadStockProducts = async () => {
  const response = await api.get('/inventory/dead-stock');
  return response.data;
};
