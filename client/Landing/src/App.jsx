import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginLandingPage from './components/LoginLandingPage';

const theme = createTheme({
  palette: {
    success: {
      main: '#4caf50', // You can customize this color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoginLandingPage />
    </ThemeProvider>
  );
}

export default App;
