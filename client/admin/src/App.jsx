import { useState } from 'react'

import './App.css'
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignupAdmin from './components/SignupAdmin';
import LoginAdmin from './components/LoginAdmin';
import Home from './components/Home';
function App() {

  return (
    <>
      {/* <Navbar/> */}
      <Outlet/>
      {/* <Footer/> */}
      {/* <Home /> */}
      {/* <SignupAdmin /> */}
      <LoginAdmin />
    </>
  )
}

export default App

