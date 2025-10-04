import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { AppQueryClientProvider } from './context/QueryClientProvider';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppQueryClientProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppQueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
