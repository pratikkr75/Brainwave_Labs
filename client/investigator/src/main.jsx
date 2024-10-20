import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import {Route,RouterProvider} from 'react-router-dom';
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom';
import './index.css'
import LoginInvestigator from './components/LoginInvestigator.jsx';
import SignupInvestigator from './components/SignupInvestigator.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route index element={<Home/>}/>
    <Route path = "investigator/login" element ={<LoginInvestigator/>}/>
    <Route path = "investigator/signup" element = {<SignupInvestigator/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router = {router}/>
)
