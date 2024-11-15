import React from 'react';
import './home.css';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomeComponent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuovi il token (simula il logout)
    navigate('/'); // Torna alla pagina di login
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5">Benvenuto nella Home Page</Typography>
      <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ mt: 2 }}>
        Logout
      </Button>
    </Container>
  );
}

export default HomeComponent;