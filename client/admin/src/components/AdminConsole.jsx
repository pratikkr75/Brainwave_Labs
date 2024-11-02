import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CreateProject from '../components/CreateProject';
import MyProjectsView from '../components/AdminProjectsView';
import PendingRequets from '../components/PendingRequests';
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.clear();
      navigate('/api/admin/login');
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

const AdminConsole = () => {
  const [currentView, setCurrentView] = useState('createProject');
  const [projectAdmin, setProjectAdmin] = useState({ name: "", email: "" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  

  const menuItems = [
    { id: 'createProject', label: 'Create Project' },
    { id: 'myProjects', label: 'My Projects' },
    { id: 'pendingRequests', label: 'Requests' },
    { id: 'logout', label: 'Logout' }
  ];

  const handleMenuClick = (viewId) => {
    setCurrentView(viewId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const NavigationContent = () => (
    <List>
      {menuItems.map((item, index) => (
        <React.Fragment key={item.id}>
          <ListItem
            button
            onClick={() => handleMenuClick(item.id)}
            sx={{
              backgroundColor: currentView === item.id ? '#e0f7fa' : 'transparent',
              '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
          {index < menuItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar for mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          backgroundColor: 'white',
          color: 'black',
          hover:"pointer"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Console
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 250, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Admin Console
          </Typography>
          <NavigationContent />
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: 250,
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          height: '100vh',
          hover:"pointer"
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>
            Admin Console
          </Typography>
          <NavigationContent />
        </Box>
      </Paper>

      {/* Main Content */}
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: 8, md: 0 },
          ml: { md: '250px' },
          backgroundColor: '#f4f6f8',
        }}
      >
        <Box sx={{ p: 2 }}>
          {currentView === 'createProject' && 
            <CreateProject email={projectAdmin.email} name={projectAdmin.name} />}
          {currentView === 'myProjects' && 
            <MyProjectsView email={projectAdmin.email} name={projectAdmin.name} />}
          {currentView === 'pendingRequests' && 
            <PendingRequets email={projectAdmin.email} />}
          {currentView === 'logout' && <Logout />}
        </Box>
      </Container>
    </Box>
  );
};

export default AdminConsole;