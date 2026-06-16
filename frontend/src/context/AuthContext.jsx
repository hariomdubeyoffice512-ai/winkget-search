import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page reload pe bhi login rahe
  useEffect(() => {
    const savedUser = localStorage.getItem('winkget_user');
    const savedToken = localStorage.getItem('winkget_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await loginUser({ identifier, password });
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem('winkget_token', token);
      localStorage.setItem('winkget_user', JSON.stringify(user));

      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('winkget_token');
    localStorage.removeItem('winkget_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}