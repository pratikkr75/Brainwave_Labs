import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginLandingPage from './components/LoginLandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Box } from '@mui/material';

const theme = createTheme({
  palette: {
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
  },
  typography: {
    fontFamily: "'Lexend Deca', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <LoginLandingPage />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;