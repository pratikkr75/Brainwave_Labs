import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import CreateProject from '../components/CreateProject';
import MyProjectsView from '../components/AdminProjectsView';
import PendingRequets from '../components/PendingRequests';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  Button,
  ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  AssignmentTurnedIn as RequestIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

const Logout = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/api/admin/login');
  };

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        fontFamily:"'Lexend Deca', sans-serif"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          fontFamily:"'Lexend Deca', sans-serif"

        }}
      >
        <Typography variant="h6"
                fontFamily={"'Lexend Deca', sans-serif"}
                gutterBottom sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
          Are you sure you want to log out?
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleLogout}
            fontFamily={"'Lexend Deca', sans-serif"}

            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark },
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
    { id: 'createProject', label: 'Create Project', icon: AddIcon },
    { id: 'myProjects', label: 'My Projects', icon: DashboardIcon },
    { id: 'pendingRequests', label: 'Requests', icon: RequestIcon },
    { id: 'logout', label: 'Logout', icon: LogoutIcon }
  ];

  const handleMenuClick = (viewId) => {
    setCurrentView(viewId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const SidebarContent = () => (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' ,
      fontFamily:"'Lexend Deca', sans-serif"

    }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,

        }}
      >
        <Typography variant="h6" fontFamily={"'Lexend Deca', sans-serif"}
 sx={{ fontWeight: 500 }}>
          Admin Console
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ 
        mt: 2, 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.divider,
          borderRadius: '4px',
        },
      }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => handleMenuClick(item.id)}
            sx={{
              borderRadius: 1,
              mb: 1,
              mx: 1,
              fontFamily:"'Lexend Deca', sans-serif",

              bgcolor: currentView === item.id ? 'primary.light' : 'transparent',
              '&:hover': { 
                bgcolor: 'primary.light',
                cursor: 'pointer',
              },
            }}
          >
            <ListItemIcon>
              <item.icon color={currentView === item.id ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: currentView === item.id ? 600 : 400,
                  fontFamily:"'Lexend Deca', sans-serif"
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        p: 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}>
        <Typography variant="body2" color="text.secondary"  fontFamily={"'Lexend Deca', sans-serif"}
        >
          Logged in as:
        </Typography>
        <Typography  fontFamily={"'Lexend Deca', sans-serif"}
 variant="body2" fontWeight="500">
          {projectAdmin.name}
        </Typography>
        <Typography variant="body2" 
          fontFamily={"'Lexend Deca', sans-serif"}
           color="text.secondary">
          {projectAdmin.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar for mobile */}
      {isMobile && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: theme.zIndex.appBar,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              m: 1,
              '&:hover': { 
                cursor: 'pointer',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: 280 },
          flexShrink: { md: 0 },
        }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 280,
                boxSizing: 'border-box',
                bgcolor: 'background.paper',
              },
            }}
          >
            <SidebarContent />
          </Drawer>
        ) : (
          <Paper
            elevation={3}
            sx={{
              width: 280,
              height: '100vh',
              overflow: 'hidden',
              position: 'fixed',
              borderRadius: 0,
            }}
          >
            <SidebarContent />
          </Paper>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        fontFamily={"'Lexend Deca', sans-serif"}

        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          fontFamily:"'Lexend Deca', sans-serif",

          mt: isMobile ? '64px' : 0,
          bgcolor: '#f4f6f8',
        }}
      >
        {currentView === 'createProject' && 
          <CreateProject email={projectAdmin.email} name={projectAdmin.name} />}
        {currentView === 'myProjects' && 
          <MyProjectsView email={projectAdmin.email} name={projectAdmin.name} />}
        {currentView === 'pendingRequests' && 
          <PendingRequets email={projectAdmin.email} />}
        {currentView === 'logout' && <Logout />}
      </Box>
    </Box>
  );
};

export default AdminConsole;