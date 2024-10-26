import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import {Route,RouterProvider} from 'react-router-dom';
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom';
import './index.css'
import LoginInvestigator from './components/LoginInvestigator.jsx';
import SignupInvestigator from './components/SignupInvestigator.jsx';
import ProtectedRoute from '../../admin/src/components/ProtectedRoute.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route index element={<Home/>}/>
    <Route path = "api/investigator/login" element ={<LoginInvestigator/>}/>
    <Route path = "api/investigator/signup" element = {<SignupInvestigator/>}/>
    <Route path ="api/admin/console" element ={<ProtectedRoute/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router = {router}/>
)
