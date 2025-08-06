// web/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, check for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    if (token  && name) {
      setUser({ token, name });
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    setUser({token, name });
  };

  const logout = async() => {
    try {
      await axios.post('http://localhost:5000/api/logout', {});
    } catch (err) {
      console.error('Logout request failed:', err);
    }

    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
