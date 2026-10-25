import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const savedToken = localStorage.getItem('portfolio_admin_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const admin = await api.getAdminSession();
        if (!active) return;
        setToken(savedToken);
        setUser(admin);
        localStorage.setItem('portfolio_admin_user', JSON.stringify(admin));
      } catch (error) {
        if (!active) return;
        setToken(null);
        setUser(null);
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('portfolio_admin_token');
          localStorage.removeItem('portfolio_admin_user');
        } else {
          console.error('Could not verify the saved admin session:', error);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await api.adminLogin(email, password);
    setToken(data.token);
    setUser(data.admin);
    return data;
  };

  const logout = async () => {
    await api.adminLogout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && user?.role === 'admin', loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
