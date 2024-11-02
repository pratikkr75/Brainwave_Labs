import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import MyProjectsView from './InvestigatorProjectsView';
import InvestigatorRequest from './InvestigatorRequest';
function InvestigatorConsole() {
  const [currentView, setCurrentView] = useState('myProjects');
  const [projectInvestigator, setProjectInvestigator] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.investigatorId) {
            setProjectInvestigator({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate('/api/investigator/login');
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate('/api/investigator/login');
        }
      } else {
        navigate('/api/investigator/login');
      }
    };

    fetchAndDecodeToken();
  }, [navigate]);

  const Logout = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
        localStorage.clear();
        navigate('/api/investigator/login');
    };
  
    return (
        <Box
            textAlign="center"
            sx={{
                mt: -4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: '#f5f5f5', // Light background for the entire box
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    bgcolor: '#ffffff', // White background for the confirmation card
                    boxShadow: 3,
                    textAlign: 'center',
                    width: '300px', // Fixed width for the card
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                    Are you sure you want to log out?
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogout}
                        sx={{
                            mr: 2,
                            backgroundColor: '#1976d2', // Primary color
                            '&:hover': { backgroundColor: '#115293' }, // Hover effect
                        }}
                    >
                        Yes
                    </Button>
                   
                </Box>
            </Paper>
        </Box>
    );
  };
  

  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', padding: 2 }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Sidebar for navigation */}
        <Paper elevation={3} sx={{ width: '250px', padding: 2, marginRight: 2 }}>
          <Typography variant="h5" gutterBottom>Investigator Console</Typography>
          <List>
            <ListItem
              button
              onClick={() => setCurrentView('myProjects')}
              sx={{
                backgroundColor: currentView === 'myProjects' ? '#e0f7fa' : 'transparent',
                '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
              }}
            >
              <ListItemText primary="My Projects" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => setCurrentView('request')}
              sx={{
                backgroundColor: currentView === 'request' ? '#e0f7fa' : 'transparent',
                '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
              }}
            >
              <ListItemText primary="Request Status" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => setCurrentView('logout')}
              sx={{
                backgroundColor: currentView === 'logout' ? '#e0f7fa' : 'transparent',
                '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Paper>

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {currentView === 'myProjects' && <MyProjectsView email={projectInvestigator.email} name={projectInvestigator.name} />}
          {currentView === 'request' && <InvestigatorRequest investigatorEmail={projectInvestigator.email}/>}
          {currentView === 'logout' && <Logout />}
        </Box>
      </Box>
    </Container>
  );
}

export default InvestigatorConsole;
