import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Link
} from '@mui/material';
import axios from 'axios';

const LoginInvestigator = () => {
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleLoginFormSubmit = async(e) => {
        e.preventDefault();
        try{
        const formData ={
            email:email,
            password:password
        };
        const res = await axios.post('http://localhost:8000/api/investigator/login', formData);
        const token = res.data.token;
        localStorage.setItem('token',token);
        alert(res.data.message);
        navigate('/api/investigator/console');
    }catch(err){
        // alert(err.response.data.message);
        console.log(err);
    }
    }

    const handleEmail = (e) =>{
         setemail(e.target.value);
    }
    const handlePassword = (e)=>{
        setPassword(e.target.value);
    }

    return (
    <Container component="main" maxWidth="xs" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ 
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLoginFormSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="dense"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmail}
            size="small"
            autoFocus
          />
          <TextField
            margin="dense"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={handlePassword}
            size="small"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link
                component="button"
                variant="button"
                onClick={() => navigate('/api/investigator/signup')}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
    )
}

export default LoginInvestigator;