import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
      isTokenPresent();
      setLoading(false);
    }, []);

    const isTokenPresent = () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        console.log("il token sta");
        try {
          const decoded = jwtDecode(storedToken);
          setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            roles: decoded.roles,
            accessToken: storedToken,
          });
          return true;
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('accessToken');
        }
        return false;
      }
    }

    const getAccessToken = () => {
      return user ? user.accessToken : localStorage.getItem('accessToken');
    };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);