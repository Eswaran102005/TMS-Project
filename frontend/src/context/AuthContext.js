import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchProfile = useCallback(async (retryCount = 0) => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      const status = error.response?.status;
      console.error('Failed to fetch profile:', error.message);

      if (status === 401 || status === 403 || status === 404) {
        // Token is invalid, expired, or user not found — force logout
        console.warn('Token invalid or user not found. Logging out.');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      } else if (!status && retryCount < 2) {
        // Network error (Render cold start / server waking up) — retry after delay
        // Keep loading=true so the loading screen stays visible during retry
        console.warn(`Network error. Retrying (${retryCount + 1}/2) in 3s...`);
        setTimeout(() => fetchProfile(retryCount + 1), 3000);
      } else {
        // Max retries reached or other error — give up
        console.error('Could not fetch profile. Keeping token, trying to continue.');
        setLoading(false);
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const { token: newToken, user: userData } = response.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    fetchProfile,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
