import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';



export default function History() {
  
    const {getHistoryOfUser} = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);

    const routoTo = useNavigate();

    let key = 0;

    useEffect(()=>{

        const fetchHistory = async()=>{
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
                console.log(history);
            } catch (e) {
                // implement snakbar
            }

        }

        fetchHistory();
    }, []);

    let formatDate = (dateString)=>{
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth()+1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }

    let i = 0;



  return (
    <div>
      <IconButton onClick={()=>{
        routoTo("/home")
      }}>
        <HomeIcon style={{color:"white"}}/>
      </IconButton>

      
      {
       
        meetings.map((e)=>{
          return(
              <Card key={i} variant="outlined">
                 <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                      Code : {e.meatingCode}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                      {console.log(e)}
                      Date : {formatDate(e.date)}
                    </Typography>
                 </CardContent>
              </Card>
          )
        })
      }
     
    </div>
  )
  
}
