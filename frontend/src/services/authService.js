import api from './apiClient';

// Auth endpoints
export const signup = async (payload) => {
  const { data } = await api.post('/auth/signup', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

// Admin user management
export const listUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post('/users', payload);
  return data;
};

export const updateUser = async (id, updates) => {
  const { data } = await api.put(`/users/${id}`, updates);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
