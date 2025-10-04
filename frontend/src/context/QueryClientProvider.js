import React from 'react';
import { QueryClient, QueryClientProvider as RQProvider } from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export const AppQueryClientProvider = ({ children }) => (
  <RQProvider client={client}>{children}</RQProvider>
);
