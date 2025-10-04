import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ems_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ems_token'));

  const login = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('ems_user', JSON.stringify(u));
    localStorage.setItem('ems_token', t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ems_user');
    localStorage.removeItem('ems_token');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
