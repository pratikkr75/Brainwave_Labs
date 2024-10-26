import React, { useState, useEffect } from 'react';
import CreateProject from '../components/CreateProject';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MyProjectsView from '../components/MyProjectsView';

function AdminConsole() {
  const [currentView, setCurrentView] = useState('createProject');
  const [projectAdmin, setProjectAdmin] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.adminId) {
            setProjectAdmin({
              name: `${decodedToken.firstname} ${decodedToken.lastname}`,
              email: decodedToken.email,
            });
          } else {
            navigate('/api/admin/login');
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          navigate('/api/admin/login');
        }
      } else {
        navigate('/api/admin/login');
      }
    };

    fetchAndDecodeToken();
  }, [navigate]);

  const ProfileView = () => <Paper><h2>Profile</h2></Paper>;

  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', backgroundColor: '#f4f6f8', padding: 2 }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Sidebar for navigation */}
        <Paper elevation={3} sx={{ width: '250px', padding: 2, marginRight: 2 }}>
          <Typography variant="h5" gutterBottom>Admin Console</Typography>
          <List>
            <ListItem button onClick={() => setCurrentView('createProject')}>
              <ListItemText primary="Create Project" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setCurrentView('myProjects')}>
              <ListItemText primary="My Projects" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setCurrentView('profile')}>
              <ListItemText primary="Profile" />
            </ListItem>
          </List>
        </Paper>

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          {currentView === 'createProject' && <CreateProject  email={projectAdmin.email} name={projectAdmin.name} />}
          {currentView === 'myProjects' && <MyProjectsView email={projectAdmin.email} name={projectAdmin.name} />}
          {currentView === 'profile' && <ProfileView />}
        </Box>
      </Box>
    </Container>
  );
}

export default AdminConsole;
