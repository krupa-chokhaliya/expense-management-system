import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err?.response?.data || err)
);

// Company endpoints (used by AdminPanel)
export const getCompany = async () => {
  const { data } = await api.get('/company');
  return data;
};

export const updateApprovalRules = async ({ approvalRules }) => {
  const { data } = await api.put('/company/approval-rules', { approvalRules });
  return data;
};

export default api;
