import api from './api';

export const getDeadStockSummary = async () => {
  const response = await api.get('/inventory/dead-stock/summary');
  return response.data;
};

export const getDeadStockProducts = async () => {
  const response = await api.get('/inventory/dead-stock');
  return response.data;
};
