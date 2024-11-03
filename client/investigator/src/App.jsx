import { useState } from 'react'

import './App.css'
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignupInvestigator from './components/SignupInvestigator';
import LoginInvestigator from './components/LoginInvestigator';
import InvestigatorConsole from './components/InvestigatorConsole';
function App() {

  return (
    <>
      <Outlet/>

    </>
  )
}

export default App
