import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('stocksense_token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('stocksense_username') || null);
  const [role, setRole] = useState(() => localStorage.getItem('stocksense_role') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUsername(null);
      setRole(null);
    };

    window.addEventListener('stocksense_unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('stocksense_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (userCredentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', userCredentials);
      const { token: jwtToken, username: authUser, role: authRole } = response.data;

      localStorage.setItem('stocksense_token', jwtToken);
      localStorage.setItem('stocksense_username', authUser);
      localStorage.setItem('stocksense_role', authRole);

      setToken(jwtToken);
      setUsername(authUser);
      setRole(authRole);

      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 401 ? 'Invalid username or password.' : 'Unable to connect to the server.');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };
      const response = await api.post('/auth/register', payload);
      return { success: true, data: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please check your information and try again.';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('stocksense_token');
    localStorage.removeItem('stocksense_username');
    localStorage.removeItem('stocksense_role');
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  const value = {
    token,
    username,
    role,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
