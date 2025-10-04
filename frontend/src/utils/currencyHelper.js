import { getCompany } from '../services/apiClient';

export const getBaseCurrency = () => {
  try {
    const u = JSON.parse(localStorage.getItem('ems_user'));
    return u?.company?.baseCurrency || 'USD';
  } catch {
    return 'USD';
  }
};

export const convertPreview = async (amount, fromCurrency) => {
  const base = getBaseCurrency();
  if (!amount || !fromCurrency) return { amount: 0, base };
  if (fromCurrency === base) return { amount: Number(amount), base };
  const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await res.json();
  const rate = data?.rates?.[base];
  if (!rate) return { amount: Number(amount), base };
  return { amount: Number((Number(amount) * rate).toFixed(2)), base };
};
