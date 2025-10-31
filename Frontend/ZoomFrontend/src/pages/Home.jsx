import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../App.css"
import IconButton from '@mui/material/IconButton';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../context/AuthContext';

export default function Home() {

    let navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");

    const {addToUserHistory} = useContext(AuthContext);

    let handleJoinVideoCall = async ()=>{
        await addToUserHistory(meetingCode);
       navigate(`/${meetingCode}`)
    }


  return (
    <div style={{backgroundColor:"white", width:"100vw", height:"100vh"}} className="homeComponent">

        <div className='navBar'>

            <div style={{display:"flex", alignItems:"center", color:"black"}}>

                <h3>ViConnect</h3>

            </div>

            <div style={{display:"flex", alignItems:"center"}}>

                <IconButton onClick={()=>{navigate("/history")}}> 
                    <RestoreIcon />
                    <p>History</p>
                </IconButton>
                <Button onClick={()=>{
                    localStorage.removeItem("token")
                    navigate("/auth");
                }}>
                    Logout
                </Button>

            </div>
        </div>

        <div className="meetContainer">
            <div className="leftPanel">
                <div>
                    <h2 style={{color :"black", padding:"3rem"}}>Providing Quality Video Call Just Like Quality Education</h2>

                    <div style={{display:"flex", gap:"10px", padding:"2rem"}}>
                        <TextField onChange={(e)=> setMeetingCode(e.target.value)} id=''></TextField>
                        <Button onClick={handleJoinVideoCall} variant='contained'>Join Now</Button>
                    </div>
                </div>
            </div>
            <div className="rightPanel">
                <img src='../public/logo3.png' alt="image" />
            </div>
        </div>
      
    </div>
  )
}
