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
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
  ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import MyProjectsView from './InvestigatorProjectsView';
import InvestigatorRequest from './InvestigatorRequest';
// Import necessary icons
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AssignmentTurnedIn as RequestIcon,
  ExitToApp as LogoutIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

function InvestigatorConsole() {
  const [currentView, setCurrentView] = useState('myProjects');
  const [projectInvestigator, setProjectInvestigator] = useState({ name: "", email: "" });
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const Logout = () => {
    const handleLogout = () => {
      localStorage.clear();
      navigate('/api/investigator/login');
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
          fontFamily:"'Lexend Deca', sans-serif",
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
            fontFamily:"'Lexend Deca', sans-serif",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              Yes, Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const SidebarContent = () => (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6"  fontFamily={"'Lexend Deca', sans-serif"}sx={{ fontWeight: 500 }}>
          Investigator Console
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ mt: 2, flexGrow: 1 }}>
        <ListItem
          button
          onClick={() => handleNavigation('myProjects')}
          sx={{
            mb: 1,
            bgcolor: currentView === 'myProjects' ? 'primary.light' : 'transparent',
            '&:hover': { bgcolor: 'primary.light', cursor: 'pointer' },
          }}
        >
          <ListItemIcon>
            <DashboardIcon color={currentView === 'myProjects' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="My Projects"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: currentView === 'myProjects' ? 600 : 400,
                fontFamily:"'Lexend Deca', sans-serif"
              },
            }}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation('request')}
          sx={{
            mb: 1,
            fontFamily:"'Lexend Deca', sans-serif",
            bgcolor: currentView === 'request' ? 'primary.light' : 'transparent',
            '&:hover': { bgcolor: 'primary.light', cursor: 'pointer' },
          }}
        >
          <ListItemIcon>
            <RequestIcon color={currentView === 'request' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Request Status"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: currentView === 'request' ? 600 : 400,
                fontFamily:"'Lexend Deca', sans-serif"
              },
            }}
          />
        </ListItem>
        <ListItem
          button
          onClick={() => handleNavigation('logout')}
          sx={{
            mb: 1,
            bgcolor: currentView === 'logout' ? 'primary.light' : 'transparent',
            '&:hover': { bgcolor: 'primary.light', cursor: 'pointer' },
          }}
        >
          <ListItemIcon>
            <LogoutIcon color={currentView === 'logout' ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            sx={{
              '& .MuiTypography-root': {
                fontWeight: currentView === 'logout' ? 600 : 400,
                fontFamily:"'Lexend Deca', sans-serif"
              },
            }}
          />
        </ListItem>
      </List>
      
      <Box sx={{ p: 2, 
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
         mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary" fontFamily={"'Lexend Deca', sans-serif"}>
          Logged in as:
        </Typography>
        <Typography variant="body2" fontWeight="500"  fontFamily={"'Lexend Deca', sans-serif"}>
          {projectInvestigator.name}
        </Typography>
        <Typography variant="body2" color="text.secondary"  fontFamily={"'Lexend Deca', sans-serif"}>
          {projectInvestigator.email}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
            sx={{ m: 1 }}
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
              keepMounted: true, // Better mobile performance
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
              position: 'fixed',
              height: '100vh',
              overflow: 'auto',
              borderRadius: 0,
            }}
          >
            <SidebarContent />
          </Paper>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          mt: isMobile ? '64px' : 0,
          bgcolor: '#f4f6f8',
        }}
      >
        {currentView === 'myProjects' && (
          <MyProjectsView 
            email={projectInvestigator.email} 
            name={projectInvestigator.name} 
          />
        )}
        {currentView === 'request' && (
          <InvestigatorRequest 
            investigatorEmail={projectInvestigator.email}
          />
        )}
        {currentView === 'logout' && <Logout />}
      </Box>
    </Box>
  );
}

export default InvestigatorConsole;
