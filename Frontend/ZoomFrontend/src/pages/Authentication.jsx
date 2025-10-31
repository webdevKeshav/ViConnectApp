import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';


const defaultTheme = createTheme();

export default function Authentication() {
 
  const [name, setName]         = React.useState();
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [error, setError]       = React.useState();
  const [message, setMessage]   = React.useState();

  const [formState, setFormState] = React.useState(0);
  const [open, setOpen]           = React.useState(false);

  const {handlerRegister, handleLogin} = React.useContext(AuthContext);

  let navigate = useNavigate();

  let handleAuth = async()=>{

    try {
      if(formState === 0){

        let result = await handleLogin(username, password);
        console.log(result);
        setMessage(result);
        setOpen(true);
        navigate("/home");    

      }if(formState === 1){
        let result = await handlerRegister(name, username, password);
        console.log(result);
        setMessage(result);
        setOpen(true);
        navigate("/home");
      }
    } catch (error) {
      let message = (error.message);
      setError(message);
    }
  }

  

  return (
    <div className='mainContainer' style={{marginLeft : "32vw", marginBottom : "8rem"}}>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              
               <div>
                  <Button variant={formState === 0 ? "contained" : ""} onClick={()=>setFormState(0)}>
                    Sign In
                  </Button>
                  <Button variant={formState === 1 ? "contained" : ""} onClick={()=>setFormState(1)}>
                    Sign Up 
                  </Button>
               </div>
              <Box component="form"  noValidate sx={{ mt: 1 }}>
                {formState === 1 ? <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  onChange={(e)=>setName(e.target.value)}
                /> : ""}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={(e)=>setUsername(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e)=>setPassword(e.target.value)}
                />

                  <p style={{color:"red"}}>{error}</p>

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleAuth}
                >
                  {formState === 1 ? "Register" : "Login"}
                </Button>
              </Box>
            </Box>
          </Container>

                    <Snackbar 

                    open={open}
                    autoHideDuration={4000}
                    message={message}

                    />

        </ThemeProvider>
    </div>
  );
}