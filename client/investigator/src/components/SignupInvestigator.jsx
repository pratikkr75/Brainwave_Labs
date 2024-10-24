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

const SignupInvestigator = () => {
    const [email,setemail] = useState("");
    const [password,setPassword] = useState("");
    const [firstname,setFirstName] = useState("");
    const [lastname,setLastName] = useState("");
    const handleSignupFormSubmit = async(e) => {
        e.preventDefault();
        try{
        const formData ={
            firstname:firstname,
            lastname:lastname,
            email:email,
            password:password
        };
        const res = await axios.post('http://localhost:8000/api/investigator/signup', formData);
        alert(res.data.message);
    }catch(error){
            if (error.response && error.response.data && error.response.data.errors) {
              const backendErrors = error.response.data.errors;
              const errorObj = {};
              backendErrors.forEach((err) => {
                errorObj[err.path] = err.message;
                alert(err.message);
              });
              setErrors(errorObj); // Set errors in state
            } else {
              alert(error.response.data.message);
            }}}

    const handleLastName = (e) =>{
        setLastName(e.target.value);
   }
    const handleFirstName = (e) =>{
        setFirstName(e.target.value);
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
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSignupFormSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            value={firstname}
            onChange={handleFirstName}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            value={lastname}
            onChange={handleLastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={handleEmail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={handlePassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Link
                component="button"
                variant="button"
                onClick={() => navigate('/login')}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
    )
}

export default SignupInvestigator;