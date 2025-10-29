import React from 'react'
import {Link} from "react-router-dom";

export default function LandingPage() {
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className="navHeader">
              <h2>ViConnect Video Call</h2>
        </div>
        <div className='navList'>
            <p>Join as Guest</p>
            <div>Register</div>
            <div role='button'><p>Login</p></div>
         </div>
      </nav>

      <div className='landingPageMainContainer'>
        <div className="left">
            <h1><span style={{color : '#FF9839'}}>Connect</span> with your Loved Ones</h1>
             <p>Cover a distence by ViConnect video call</p>
             <div role='button'><Link to={'/auth'}>Get Started</Link></div>
        </div>
        <div className="right">
          {/* <img src="\ChatGPT Image Sep 4, 2025, 09_36_56 PM.png" alt="demoImage" /> */}
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  )
}
