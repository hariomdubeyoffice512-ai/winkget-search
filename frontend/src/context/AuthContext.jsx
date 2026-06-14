import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Dummy user data
const DUMMY_USER = {
  firstName: 'Hariom',
  lastName: 'Dubey',
  email: 'hariomdubey@winkget.com',
  accountType: 'personal',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Dummy login - backend se baad mein connect karenge
    if (email && password) {
      setUser(DUMMY_USER);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}