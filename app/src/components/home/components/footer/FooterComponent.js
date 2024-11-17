import React from 'react';
import './FooterComponent.css';
import { Box, Typography } from '@mui/material';

const FooterComponent = () => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        textAlign: 'center',
        p: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="body2">© 2024 Blue Freedive</Typography>
    </Box>
  );
};

export default FooterComponent;