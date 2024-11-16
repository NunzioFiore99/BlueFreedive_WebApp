// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        const decoded = jwtDecode(accessToken);
        setUser({
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles,
          accessToken,
        });
      };

      const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
      };

      const getAccessToken = () => localStorage.getItem('token');

  return (
    <AuthContext.Provider value={{ user, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);