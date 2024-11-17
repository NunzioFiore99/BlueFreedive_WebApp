import React from 'react';
import './SidebarComponent.css';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { AccountCircle, Person, Group, Home } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const SidebarComponent = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Homepage', icon: <Home />, path: '/' },
    { label: 'Profile', icon: <AccountCircle />, path: '/profile' },
    { label: 'Dive Sessions', icon: <Person />, path: '/dive' },
  ];

  if (user?.roles.includes('ROLE_ADMIN')) {
    menuItems.push({ label: 'Manage Users', icon: <Group />, path: '/users-management' });
  }

  return (
    <StyledDrawer variant="permanent">
      <List sx={{ paddingTop: 0 }}>
        <Divider sx={{ borderColor: '#bbb', marginTop: "4rem" }} />
        {menuItems.map((item, index) => (
          <ListItem 
            button 
            key={index} 
            component={Link} 
            to={item.path} 
            sx={{
              '&:hover': {
                backgroundColor: '#1976d2',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
              padding: '12px 20px',
              transition: 'all 0.3s ease-in-out',
              borderRadius: '8px',
              marginBottom: '8px',
            }}
          >
            <ListItemIcon 
              sx={{
                minWidth: '40px',
                color: '#1976d2',
                transition: 'color 0.3s ease-in-out',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{
                fontWeight: 'bold',
                color: 'black',
                transition: 'color 0.3s ease-in-out',
              }} 
            />
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  color: 'white',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(2),
}));

export default SidebarComponent;