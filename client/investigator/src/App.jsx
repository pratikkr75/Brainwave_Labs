import { useState } from 'react'

import './App.css'
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignupInvestigator from './components/SignupInvestigator';
import LoginInvestigator from './components/LoginInvestigator';
function App() {

  return (
    <>
      {/* <Navbar/> */}
      <Outlet/>
   
 
      {/* <Footer/> */}
    </>
  )
}

export default App
