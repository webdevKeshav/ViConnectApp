import React from 'react'
import {Link, useNavigate} from "react-router-dom";

export default function LandingPage() {
  let navigate = useNavigate();
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className="navHeader">
              <h2>ViConnect Video Call</h2>
        </div>
        <div className='navList'>
            <p onClick={()=>   navigate("/random")}>Join as Guest</p>
            <div onClick={()=> navigate("/auth")}>Register</div>
            <div onClick={()=> navigate("/auth")} role='button'><p>Login</p></div>
         </div>
      </nav>

      <div className='landingPageMainContainer'>
        <div className="left">
            <h1><span style={{color : '#FF9839'}}>Connect</span> with your Loved Ones</h1>
             <p>Cover a distence by ViConnect video call</p>
             <div role='button'><Link to={'/auth'}>Get Started</Link></div>
        </div>
        <div className="right">
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  )
}
