import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Chip } from '@mui/material';

const LoginLandingPage = () => {
  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      mb: 4 // Added margin bottom
    }}>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={0}
        sx={{ 
          width: '100%',
          height: '100%',
        }}
      >
        {/* Admin Card */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          minWidth: { xs: '100%', md: '50%' },
        }}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 0,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <CardContent sx={{ 
              textAlign: 'center',
              p: 4,
              maxWidth: '400px',
              margin: '0 auto',
              width: '100%'
            }}>
              <Chip 
                label="BUSINESS" 
                color="primary" // Changed from success to primary (blue)
                sx={{ mb: 2 }}
              />
              
              <Typography variant="h4" gutterBottom>
                For <Box component="span" sx={{ color: 'primary.main' }}>Admin</Box>
              </Typography>
              
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Join Now and Create your TEAM.<br></br> Start working towards Research & Innovation.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" // Changed from success to primary
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
                component="a"
                href="http://localhost:3000/api/admin/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                LOGIN
              </Button>
              
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Don't have an account?
              </Typography>
              
              <Button 
                color="inherit" 
                sx={{ mt: 1 }}
                component="a"
                href="http://localhost:3000/api/admin/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
                SIGN UP
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Investigators Card */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          minWidth: { xs: '100%', md: '50%' },
        }}>
          <Card sx={{ 
            width: '100%',
            borderRadius: 0,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <CardContent sx={{ 
              textAlign: 'center',
              p: 4,
              maxWidth: '400px',
              margin: '0 auto',
              width: '100%'
            }}>
              <Chip 
                label="BUSINESS" 
                color="primary" // Changed from success to primary
                sx={{ mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                For <Box component="span" sx={{ color: 'primary.main' }}>Investigators</Box>
              </Typography>
              
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Join Now and Be a part of innovative projects. Make contributions to Research & Innovation.
              </Typography>
              
              <Button 
                variant="outlined" 
                color="primary" // Added color="primary"
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
                component="a"
                href="http://localhost:5000/api/investigator/login"
                target="_blank"
                rel="noopener noreferrer"
              >
                LOGIN
              </Button>
              
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Don't have an account?
              </Typography>
              
              <Button 
                color="inherit" 
                sx={{ mt: 1 }}
                component="a"
                href="http://localhost:5000/api/investigator/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
                SIGN UP
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default LoginLandingPage;