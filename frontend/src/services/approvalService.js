import api from './apiClient';

export const myApprovals = async () => {
  const { data } = await api.get('/approvals/my');
  return data;
};

export const actOnApproval = async (id, action, comments = '') => {
  const { data } = await api.post(`/approvals/${id}/action`, { action, comments });
  return data;
};

export const adminOverride = async (expenseId, action, comments = '') => {
  const { data } = await api.post(`/approvals/override/${expenseId}`, { action, comments });
  return data;
};
