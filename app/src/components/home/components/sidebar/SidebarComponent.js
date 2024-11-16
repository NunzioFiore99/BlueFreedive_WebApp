import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { AccountCircle, Person, Group } from '@mui/icons-material';
import { useAuth } from '../../../../context/AuthContext';
import { Link } from 'react-router-dom';

const SidebarComponent = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Profile', icon: <AccountCircle />, path: '/profile' },
    { label: 'Dive Sessions', icon: <Person />, path: '/dive-sessions' },
  ];

  if (user?.roles.includes('ROLE_ADMIN')) {
    menuItems.push({ label: 'Manage Users', icon: <Group />, path: '/manage-users' });
  }

  return (
    <Drawer variant="permanent" sx={{ width: 240 }}>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button={true} key={index} component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SidebarComponent;