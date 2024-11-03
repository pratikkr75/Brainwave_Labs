import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'white',
        borderTop: '1px solid #E0E0E0',
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          fontFamily: "'Lexend Deca', sans-serif",
          fontSize: '0.875rem',
          letterSpacing: '0.5px'
        }}
      >
        Copyright © Brainwave Labs {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;