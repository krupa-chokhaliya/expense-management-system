import api from './apiClient';

export const fetchCurrencies = async () => {
  // Backend uses live API; frontend can hit it directly for simplicity
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
  const data = await res.json();
  const list = [];
  data.forEach((c) => {
    if (c.currencies) {
      Object.entries(c.currencies).forEach(([code, meta]) => {
        list.push({ code, name: meta.name, country: c.name?.common });
      });
    }
  });
  const map = new Map();
  list.forEach((i) => { if (!map.has(i.code)) map.set(i.code, i); });
  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
};

export const createExpense = async (formData) => {
  const { data } = await api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const listMyExpenses = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/expenses/me?page=${page}&limit=${limit}`);
  return data;
};

export const listCompanyExpenses = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/expenses/company?page=${page}&limit=${limit}`);
  return data;
};

export const listTeamExpenses = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/expenses/team?page=${page}&limit=${limit}`);
  return data;
};
