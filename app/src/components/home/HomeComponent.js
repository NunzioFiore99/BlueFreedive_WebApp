import React from 'react';
import './HomeComponent.css';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './components/sidebar/SidebarComponent';
import Header from './components/header/HeaderComponent';
import Footer from './components/footer/FooterComponent';
import { Outlet } from 'react-router-dom';

function HomeComponent() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar />
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default HomeComponent;