// Mock helpers to enable frontend-only development without backend

export const parseReceipt = async () => {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 300));
  return {
    merchant: 'Mock Cafe',
    amount: 12.5,
    date: new Date().toISOString(),
    notes: 'Latte and croissant',
  };
};
