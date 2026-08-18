import api from './api';

export const getAlertSummary = async () => {
  const response = await api.get('/alerts/summary');
  return response.data;
};

export const getLowStockAlerts = async () => {
  const response = await api.get('/alerts/low-stock');
  return response.data;
};

export const getExpiringSoonAlerts = async () => {
  const response = await api.get('/alerts/expiring-soon');
  return response.data;
};

export const getExpiredAlerts = async () => {
  const response = await api.get('/alerts/expired');
  return response.data;
};
