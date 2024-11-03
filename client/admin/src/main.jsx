import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import {Route,RouterProvider} from 'react-router-dom';
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom';
import './index.css'
import LoginAdmin from './components/LoginAdmin.jsx';
import SignupAdmin from './components/SignupAdmin.jsx';
import AdminConsole from './components/AdminConsole.jsx';
import ProjectProfile from './components/AdminProjectProfile.jsx';
import AdminFileUpload from './components/AdminFileUpload.jsx';
import AdminAssignTask from './components/AdminAssignTask.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route index element={<Home/>}/>
    <Route path = "api/admin/login" element ={<LoginAdmin/>}/>
    <Route path = "api/admin/signup" element = {<SignupAdmin/>}/>
    <Route path = "api/admin/console" element = {<AdminConsole/>}/>
    <Route path = "api/admin/console/project/:projectCode" element={<ProjectProfile/>}/>
    <Route path ="api/admin/console/project/uploads/:projectCode" element={<AdminFileUpload/>}/>
    <Route path = "api/admin/console/project/assign/tasks/:projectCode" element={<AdminAssignTask/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router = {router}/>
)
