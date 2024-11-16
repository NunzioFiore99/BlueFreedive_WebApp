// src/components/RequireAuth.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Se l'utente non è autenticato, reindirizza alla pagina di login
  if (!user) return <Navigate to="/login" replace />;

  // Se ci sono ruoli specificati e l'utente non ha uno dei ruoli necessari, reindirizza a un'altra pagina
  if (roles && !roles.some((role) => user.roles.includes(role))) return <Navigate to="/" replace />;

  // Se l'utente è autenticato e ha il ruolo necessario, permette di visualizzare i componenti figli (Outlet)
  return <Outlet />;
};

export default RequireAuth;