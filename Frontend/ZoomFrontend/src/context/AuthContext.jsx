import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL : "https://viconnectapp.onrender.com/api/v1/user"
});

export const AuthProvider = ({children})=>{

  // const router = useNavigate();

  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const handlerRegister = async(name, username, password)=>{
    try {
      let request = await client.post("/register", {
        name : name,
        username : username,
        password : password
      })

      if(request.status === httpStatus.CREATED){
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  }

  const handleLogin = async (username, password)=>{
    try {
        let request = await client.post("/login", {
          username : username,
          password : password
        });
        
        if(request.status === httpStatus.OK){

          localStorage.setItem("token", request.data.token);
          return request.data.message;

        }

    } catch (error) {

      console.log(error);
      throw error;

    }
  }

  const getHistoryOfUser = async()=>{
      try {
          let request = await client.get("/get_all_activity", {
              params:{
                  token : localStorage.getItem("token")
              }
          });
          return request.data
      } catch (error) {
          throw error;
      }
  }


  const addToUserHistory = async (meetingCode)=>{
    try {
      let request = await client.post("/add_to_activity", {
        token : localStorage.getItem("token"),
        meeting_code : meetingCode
      });
      return request;
    } catch (error) {
       throw error;
    }
  }

  const data = {
     userData, setUserData, handlerRegister, handleLogin, getHistoryOfUser, addToUserHistory
  }

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  )
}