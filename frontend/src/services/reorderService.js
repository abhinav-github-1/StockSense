import api from './api';

export const getReorderRecommendations = async () => {
  const response = await api.get('/reorder/recommendations');
  return response.data;
};
