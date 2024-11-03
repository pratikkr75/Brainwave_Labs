import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import Connection from './database/db.js'; 

// Import the admin routers
import { adminSignupRouter, adminLoginRouter } from './user/admin/adminLoginSignup.js';
import {investigatorSignupRouter, investigatorLoginRouter} from './user/investigator/investigatorLoginSignup.js';
import {createProjectRouter} from './project/createProject.js';
import {findInvestigator} from './user/investigator/findinvestigator.js'
import { addInvestigator } from './user/investigator/addInvestigator.js';
import {getAllProjectAdmin} from './project/getAllProjectAdmin.js';
import { getAllProjectInvestigator } from './project/getAllProjectInvestigator.js';
import { projectprofileAdmin } from './project/projectprofileAdmin.js';
import { deleteInvestigator } from './project/deleteInvestigator.js';
import { updateProject } from "./project/updateProject.js";
import { updateTrack } from "./project/updateTrack.js";
import { projectprofileInvestigator } from './project/projectprofileInvestigator.js';
import {investigatorProjectRequest} from './project/investigatorProjectRequest.js';
import { adminpendingRequests } from './project/adminpendingRequests.js';
import { adminRejectRequest } from './project/adminRejectRequest.js';
import { adminAcceptRequest } from './project/adminAcceptRequest.js';
import { getProjectFiles } from './project/getProjectFiles.js';
import {uploadProjectReport} from './project/uploadProjectReport.js'
import { upload, uploadFile, getFile } from "./utils/upload.js";
import { fileServingRouter } from './project/fileServing.js';
import {investigatorAllRequest} from './project/investigatorAllRequest.js';
import { adminpostTask } from './project/adminpostTask.js';
import {admingetTasks} from './project/admingetTasks.js';
import { adminUpdateTaskStatus } from './project/adminUpdateTaskStatus.js';
import {investigatorRequestDeadline} from './project/investigatorRequestDeadline.js';
import { adminUpdateTaskDeadline } from './project/adminUpdateTaskDeadline.js';
import { adminRejectTaskDeadline } from './project/adminRejectTaskDeadline.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


// Use the admin routers
app.use(adminSignupRouter);
app.use(adminLoginRouter);

// Use the investigator routers
app.use(investigatorSignupRouter);
app.use(investigatorLoginRouter);

//createProject router
app.use(createProjectRouter);

//find list of Investigator based on email (only those that do not belong to a particular project)
app.use(findInvestigator);

// add Investigator to project
app.use(addInvestigator);

//get all projects for a admin
app.use(getAllProjectAdmin);

//get all projects for a investigator
app.use(getAllProjectInvestigator);

//get details of a particular project for admin
app.use(projectprofileAdmin);

//delete an investigator from a project by admin
app.use(deleteInvestigator);

//update project details requested by admin
app.use(updateProject);
app.use(updateTrack);

//upload files
app.use(uploadProjectReport);

// Use the project files route
app.use(getProjectFiles);  // For getting list of files
app.get('/files/:filename', getFile);  // For serving individual files

//file serving route to view uploaded files
app.use(fileServingRouter);

//get particular project for investigator
app.use(projectprofileInvestigator);

//request by investigator for change in project
app.use(investigatorProjectRequest);

//to get all pending requests for admin
app.use(adminpendingRequests);

//get all investigator request
app.use(investigatorAllRequest);

//to reject request made by investigator from admin
app.use(adminRejectRequest);

//to accept request made by investigator from admin
app.use(adminAcceptRequest);

//assign new task by admin
app.use(adminpostTask);

//get all tasks for admin
app.use(admingetTasks);

//update the status to Missed
app.use(adminUpdateTaskStatus);

//request for deadline extension for tasks by investigator
app.use(investigatorRequestDeadline);

//accept and reject task deadline by admin
app.use(adminUpdateTaskDeadline);
app.use(adminRejectTaskDeadline);

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
