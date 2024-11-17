import React from 'react';
import './HeaderComponent.css';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../../services/AuthClient';

const Header = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{background: "lightBlue"}}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1}}/>
        {user && (
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;