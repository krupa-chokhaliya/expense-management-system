export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount || 0));
  } catch {
    return `${amount} ${currency}`;
  }
};

export const formatDate = (d) => {
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
};
