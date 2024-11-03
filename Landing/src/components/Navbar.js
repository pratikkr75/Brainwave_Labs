import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E0E0',
        marginBottom: '4.5rem' // Add margin bottom
      }}
    >
      <Toolbar sx={{
        justifyContent: 'flex-start',
        minHeight: '70px',
        px: { xs: 2, sm: 4, md: 6 }
      }}>
        <Typography 
          variant="h6" 
          sx={{
            color: '#1976D2', // Changed to Material-UI primary blue
            fontWeight: 600,
            letterSpacing: '0.5px',
            fontFamily: "'Lexend Deca', sans-serif",
            '&:hover': {
              color: '#1565C0', // Darker blue on hover
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }
          }}
        >
          Brainwave Labs
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;