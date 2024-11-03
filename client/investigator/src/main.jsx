import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Home from './components/Home.jsx'
import {Route,RouterProvider} from 'react-router-dom';
import { createBrowserRouter,createRoutesFromElements } from 'react-router-dom';
import './index.css'
import LoginInvestigator from './components/LoginInvestigator.jsx';
import SignupInvestigator from './components/SignupInvestigator.jsx';
import InvestigatorConsole from './components/InvestigatorConsole.jsx';
import ProjectProfile from './components/InvestigatorProjectProfile.jsx';
import InvestigatorUploadFile from './components/InvestigatorUploadFile.jsx';
import InvestigatorTasks from './components/InvestigatorTasks.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App/>}>
    <Route index element={<Home/>}/>
    <Route path = "api/investigator/login" element ={<LoginInvestigator/>}/>
    <Route path = "api/investigator/signup" element = {<SignupInvestigator/>}/>
    <Route path = "api/investigator/console" element = {<InvestigatorConsole/>}/>
    <Route path = "api/investigator/console/project/:projectCode" element={<ProjectProfile/>}/>
    <Route path = "api/investigator/console/project/uploads/:projectCode" element={<InvestigatorUploadFile/>}/>
    <Route path ="api/investigator/console/project/tasks/:projectCode" element={<InvestigatorTasks/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <RouterProvider router = {router}/>
)
