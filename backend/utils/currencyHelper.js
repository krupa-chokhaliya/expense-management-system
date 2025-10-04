import axios from 'axios';

export const fetchCurrencies = async () => {
  const { data } = await axios.get('https://restcountries.com/v3.1/all?fields=name,currencies');
  const list = [];
  data.forEach((c) => {
    if (c.currencies) {
      Object.entries(c.currencies).forEach(([code, meta]) => {
        list.push({ code, name: meta.name, country: c.name?.common });
      });
    }
  });
  // Deduplicate by code
  const map = new Map();
  list.forEach((item) => { if (!map.has(item.code)) map.set(item.code, item); });
  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
};

export const convertAmount = async (amount, from, to) => {
  if (from === to) return amount;
  const { data } = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
  const rate = data.rates?.[to];
  if (!rate) throw new Error(`No rate from ${from} to ${to}`);
  return Number((amount * rate).toFixed(2));
};
