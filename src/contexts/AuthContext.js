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
    if (!token) return;
    axios.get('http://localhost:5000/api/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const { name, email } = res.data;
        setUser({ name, email, token });
      })
      .catch((err) => {
        console.error("Token invalid or expired:", err);
        localStorage.removeItem('authToken');
        setUser(null);
      });
  }, []);

  const login = (token, name, email) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    setUser({token, name, email });
  };

  const logout = async() => {
    try {
      await axios.post('http://localhost:5000/api/logout', {});
    } catch (err) {
      console.error('Logout request failed:', err);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
