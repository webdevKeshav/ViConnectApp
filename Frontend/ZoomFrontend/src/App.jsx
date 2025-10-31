import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LandingPage from './pages/LandingPage.jsx';
import Authentication from './pages/Authentication.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css';
import VideoMeet from './pages/videoMeet.jsx';
import History from './pages/history.jsx';
import Home from './pages/Home.jsx';


function App() { 

  return (
    <>

     <Router >

      <AuthProvider >

        <Routes>
          
          <Route path="/" element={<LandingPage />}></Route>

          <Route path="/home" element={<Home />}></Route>

          <Route path='auth' element={<Authentication />}></Route>

          <Route path='/:url'  element={<VideoMeet />}></Route>

          <Route path='/history' element={<History />}></Route>

        </Routes>   

      </AuthProvider>
 
     </Router>
    </>
  )
}

export default App;
