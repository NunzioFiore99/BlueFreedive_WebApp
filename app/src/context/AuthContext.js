import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

// Variabili globali
let globalAccessToken = null; // Per accedere al token globale
let globalSetToken = null;   // Per aggiornare il token globale

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
        globalAccessToken = accessToken; // Aggiorna il token globale
      };

    const logout = () => {
      localStorage.removeItem('accessToken');
      setUser(null);
      globalAccessToken = null; // Rimuove il token globale
    };

    useEffect(() => {
      isTokenPresent();
      setLoading(false);
    }, []);

    const isTokenPresent = () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
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
      return globalAccessToken || localStorage.getItem('accessToken');
    };

    // Funzione per aggiornare il token da un punto globale
    if (!globalSetToken) {
      globalSetToken = login;
    }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Funzione per accedere al token globale
export const getGlobalAccessToken = () => globalAccessToken;

// Funzione per aggiornare il token globale
export const updateGlobalAccessToken = (newToken) => {
  if (globalSetToken) {
    globalSetToken(newToken);
  }
};


export const useAuth = () => useContext(AuthContext);