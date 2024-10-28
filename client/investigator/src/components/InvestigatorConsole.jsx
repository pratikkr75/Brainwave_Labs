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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import MyProjectsView from './InvestigatorProjectsView';

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

  const ProfileView = () => <Paper><h2>Profile</h2></Paper>;
  const RequestView = () => <Paper><h2>Request</h2></Paper>;

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
              <ListItemText primary="Request" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => setCurrentView('profile')}
              sx={{
                backgroundColor: currentView === 'profile' ? '#e0f7fa' : 'transparent',
                '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
              }}
            >
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Paper>

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {currentView === 'myProjects' && <MyProjectsView email={projectInvestigator.email} name={projectInvestigator.name} />}
          {currentView === 'request' && <RequestView />}
          {currentView === 'profile' && <ProfileView />}
        </Box>
      </Box>
    </Container>
  );
}

export default InvestigatorConsole;
