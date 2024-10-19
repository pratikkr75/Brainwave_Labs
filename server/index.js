import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Connection from './database/db.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT; // Fallback to port 5000 if PORT is not defined

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

Connection();


///////////////////////////////////////////////////IMPORTANT////////////////////////////////////////////////////////////////////

//example of protected route------------------------------------------------------------
// import { verifyToken } from './middleware/auth.middleware.js';
// import express from 'express';

// const router = express.Router();

// // Example of a protected route
// router.get('/api/admin/protected-route', verifyToken, (req, res) => {
//   res.json({ 
//     message: "Protected route accessed successfully",
//     adminData: req.admin 
//   });
// });

// export default router;


//FRONTEND JWT TOKEN HANDLING---------------------------------------------------------------
// Store token after successful login
// localStorage.setItem('token', response.data.token);

// // Include token in subsequent requests
// const headers = {
//   'Authorization': `Bearer ${localStorage.getItem('token')}`
// };

// // Example axios request to a protected route
// axios.get('/api/admin/protected-route', { headers })
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.error(error.response.data);
//   });


///HAPPEN AND NEED TO BE DONE AFTER JWT TOKEN GET EXPIRED------------------------

// 2. On the Client Side (React, etc.):
// Handling Expired Tokens: When the client sends a request to the server with an expired token, the server will respond with a 401 Unauthorized status and a message saying "Token expired."
// Action After Expiration: The client will then need to handle this by logging the user out or prompting them to log in again. This involves redirecting the user to the login page, generating a new JWT token upon successful login, and storing it for future use.
// Example of Handling Expired Tokens on Client Side (React):

// // Example axios interceptor to handle expired token-----------------------

// axios.interceptors.response.use(
//   (response) => response, 
//   (error) => {
//     if (error.response && error.response.status === 401 && error.response.data.message === 'Token expired') {
//       // Token has expired, log the user out or prompt to login again
//       alert('Session expired. Please log in again.');
      
//       // Option 1: Clear the token and redirect to login page
//       localStorage.removeItem('token');
//       window.location.href = '/login';  // Redirect to login page

//       // Option 2: Implement token refresh logic (more on this below)
//     }
//     return Promise.reject(error);
//   }
// );


//--------------------------------------------------------------------
// Summary of Default Behavior (Without Refresh Token):
// After 24 hours, the JWT token expires, and the user will need to log in again to generate a new token.
// If the token expires, the client receives a 401 Unauthorized response and can log the user out or prompt
//  them to log in again.
// The user will not be logged out automatically, but their session will no longer be valid, 
// and they won't be able to access protected routes until they log in again.
