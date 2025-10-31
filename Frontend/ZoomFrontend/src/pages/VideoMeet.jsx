import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';



import styles from "../styles/videoMeet.module.css";
import Button from '@mui/material/Button';
import io from "socket.io-client";
import IconButton from '@mui/material/IconButton';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import Badge from '@mui/material/Badge';
import ChatIcon from '@mui/icons-material/Chat';

const server_url = "https://viconnectapp.onrender.com";


var connections = {};


const perrConfigConnections = {
    "iceServers" : [
        {"urls" : "stun:stun.l.google.com:19302"}
    ]
}


export default function VideoMeet(){

  var socketRef = useRef();

  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailabe] = useState(true);

  let [video, setVideo] = useState(false);

  let [audio, setAudio] = useState(true);

  let [screen, setScreen] = useState();

  let [showModal, setShowModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let[newMessages, setNewMessages] = useState(0);

  let[askForUsername, setAskForUsername] = useState(true);

  let[username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);
  
  const navigate = useNavigate();

  //  todo
  // if(isChrome === false){

  // }

  const getPermissions = async ()=>{
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({video : true});

      if(videoPermission){
        setVideoAvailable(true);
      }
      else setVideoAvailable(false);
      

      const audioPermission = await navigator.mediaDevices.getUserMedia({audio : true});

      if(audioPermission){
        setAudioAvailabe(true);
      }
      else setAudioAvailabe(false);

      if(navigator.mediaDevices.getDisplayMedia){
        setScreenAvailable(true);
      }else{
        setScreenAvailable(false);
      }

      if(videoAvailable || audioAvailable){
        const userMediaStream = await navigator.mediaDevices.getUserMedia({video : videoAvailable, audio : audioAvailable});

        if(userMediaStream){
          window.localStream = userMediaStream;

          if(localVideoRef.current){
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }

    }
     catch (error) {
       console.log(error);
    }
  }

  

  useEffect(()=>{
    getPermissions()
  }, []);



  let getUserMediaSuccess = (stream)=>{
    try {
        if (window.localStream && window.localStream.getTracks) {
           window.localStream.getTracks().forEach(track => track.stop());
        }
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for(let id in connections){
      if(id === socketIdRef.current)continue;

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((descreption)=>{
         connections[id].setLocalDescription(descreption)
         .then(()=>{
          socketRef.current.emit("signal", id, JSON.stringify({"sdp" : connections[id].localDescription}))
         })
         .catch(e => console.log(e));
      })
    }

    stream.getTracks().forEach(track => track.onended = ()=>{
        setVideo(false);
        setAudio(false);

        try {
          let tracks = localVideoRef.current.srcObject.getTracks()
          tracks.forEach(track => track.stop())
        } catch (error) {
          console.log(error);
        }

        // TODO BlackScreen

           let blackSilence = (...args) => new MediaStream([black(...args), silence()])
              window.localStream = blackSilence();
              localVideoRef.current.srcObject = window.localStream;


        for(let id in connections){
          connections[id].addStream(window.localStream)
          connections[id].createOffer().then((description)=>{
              connections[id].setLocalDescription(description)
              .then(()=>{
                socketRef.current.emit("signal", id, JSON.stringify({"sdp" : connections[id].localDescription}))
              }).catch(e => console.log(e));
          })
        }
    })
  }



  let silence = ()=>{
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], {enabled : false})
  }


  let black = ({width = 640, height = 480} ={})=>{
    let canvas = Object.assign(document.createElement("canvas"), {width, height});

    canvas.getContext('2d').fillRect(0,0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], {enabled : false})
  }




  let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video : video, audio : audio})
        .then(getUserMediaSuccess)  
        .then((stream)=>{})
        .catch((e)=>console.log(e))
    }else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop())
      } catch (error) {
        
      }
    }
  }

  useEffect(()=>{
    if(video !== undefined && audio !== undefined){
      getUserMedia();
    }
  }, [video, audio]);


  // TODO ADD Message 
  let gotMessageFromServer = (fromId, message)=>{
      var signal  = JSON.parse(message);

      if(fromId !== socketRef.current){
        if(signal.sdp){
          connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
            if(signal.sdp.type === "offer"){
              connections[fromId].createAnswer().then((descreption)=>{
                connections[fromId].setLocalDescription(descreption).then(()=>{
                  socketRef.current.emit("signal", fromId, JSON.stringify({"sdp" : connections[fromId].localDescription}))
                }).catch(e => console.log(e))
              }).catch(e => console.log(e))
            }
          }).catch(e => console.log(e));
        }
      }

      if(signal.ice){
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
      }
  }

  let addMessage = (data, sender, socketId)=>{
    console.log(sender);
    setMessages((prevMessages)=>[
      ...prevMessages,
      {sender : sender, data : data} 
    ]);

    if(socketId.sender !== socketRef.current){
    setNewMessages((prevMessages)=> prevMessages + 1)
    }
  }


  let connectToSocketServer = ()=>{

    socketRef.current = io.connect(server_url, {secure : false});
    
    socketRef.current.on('signal', gotMessageFromServer);

    socketRef.current.on("connect", ()=>{

      socketRef.current.emit("join-call", window.location.href)

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id)=>{

        setVideo((videos)=>videos.filter((video)=>video.socketId !== id))

      })

      socketRef.current.on("user-joined", (id, clients)=>{

        clients.forEach((socketListId)=>{

            connections[socketListId] = new RTCPeerConnection(perrConfigConnections) 

            connections[socketListId].onicecandidate = (event)=>{
              if(event.candidate != null){
                socketRef.current.emit("signal", socketListId, JSON.stringify({'ice' : event.candidate}))
              }
            }

            connections[socketListId].onaddstream = (event)=>{

              let videoExists = videoRef.current.find(video => video.socketId === socketListId);


              if(videoExists){
                setVideo(videos=>{
                   const updatedVideos = videos.map(video=>
                    video.socketId === socketListId ? {...video, stream : event.stream} : video
                    );
                    videoRef.current = updatedVideos;
                    return updatedVideos;
                });
              }else{

                  let newVideo = {
                    socketId : socketListId,
                    stream : event.stream,
                    autoPlay : true,
                    plassinline : true
                  }

                  setVideos(videos => {
                     const updatedVideos = [...videos, newVideo];
                     videoRef.current = updatedVideos;
                     return updatedVideos;
                  });

              }
            };

            if(window.localStream !== undefined && window.localStream !== null){
              connections[socketListId].addStream(window.localStream);
            }else{
              // todo

              let blackSilence = (...args) => new MediaStream([black(...args), silence()])
              window.localStream = blackSilence();
              connections[socketListId].addStream(window.localStream);
            }
        })

        if(id === socketRef.current){
          for(let id2 in connections){
            if(id2 === socketRef.current)continue

            try{
              connections[id2].addStream(window.localStream)
            }catch(e){}

            connections[id2].createOffer().then((description)=>{
              connections[id2].setLocalDescription(descreption)
              .then(()=>{
                socketRef.current.emit("signal", id2, JSON.stringify({"sdp" : connections[id2].localDescription}))
              })
              .catch(e=>console.log(e));
            })
          }
        }

      })
    })
  }

  let getMedia = ()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  }

  let connect = ()=>{
    setAskForUsername(false);
    getMedia();
  }

  let handleVideo = ()=>{
    setVideo(!video);
  }

  let handleAudio = ()=>{
    setAudio(!audio);
  }

  let getDisplayMediaSuccess = (stream)=>{
    try {
      window.localStream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.log(error);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for(let id in connections){
      if(id === socketIdRef.current)continue;

      connections[id].addStream(window.localStream)
      connections[id].createOffer().then((descreption)=>{
        connections[id].setLocalDescription(descreption)
        .then(()=>{
          socketRef.current.emit("signal", id, JSON.stringify({"sdp" : connections[id].localDescription}))
        })
       .catch(error => console.log(error))
      })
    }

     stream.getTracks().forEach(track => track.onended = ()=>{
       setScreen(false);

        try {
          let tracks = localVideoRef.current.srcObject.getTracks()
          tracks.forEach(track => track.stop())
        } catch (error) {
          console.log(error);
        }

        // TODO BlackScreen

           let blackSilence = (...args) => new MediaStream([black(...args), silence()])
              window.localStream = blackSilence();
              localVideoRef.current.srcObject = window.localStream;


       getUserMedia();
    })
  }

  let getDisplayMedia = ()=>{
    if(screen){
      if(navigator.mediaDevices.getDisplayMedia){
        navigator.mediaDevices.getDisplayMedia({video : true, audio : true})
        .then(getDisplayMediaSuccess)
        .then((stream)=>{})
        .catch(error => console.log(error));
      }
    }
  }

  useEffect(()=>{
    if(screen !== undefined){
      getDisplayMedia();
    }
  })

  let handleScreen = ()=>{
    setScreen(!screen);
  }

  let sendMessage = ()=>{
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  }

  let handleCall = ()=>{
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    } catch (error) {
      console.log(error);
    }
    
    navigate("/home");
    
  }










  return (
    <div>
       {askForUsername == true ? 

        <div>
            <h2>Enter into lobby</h2>
            <TextField id="outlined-basic" label="Username" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" />
            <Button variant='contained' onClick={connect}>Connect</Button>

            <div>
               <video ref={localVideoRef} autoPlay muted></video>
            </div>
        </div>
         :  
        <div className={styles.meetVideoContainer}>

          {showModal ?
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                  <h1>Chat</h1>

                  <div className={styles.chattingDisplay}>
                    {messages.map((item, index)=>{
                        return(
                          <div key={index} style={{marginBottom : "20px"}}>
                                <p style={{fontWeight : "bold"}}>{item.sender}</p>
                                <p>{item.data}</p>
                          </div>
                        )
                      })}
                  </div>

                  <div className={styles.chattingArea}>
                    <TextField style={{width:"80%"}} id="filled-basic" label="Enter the Chat" variant="filled" onChange={(e)=>{setMessage(e.target.value)}} value={message}/>
                    <Button variant='contained' onClick={sendMessage} >Send</Button>
                  </div>
              </div>
            </div> : <></>
           }

          <div className={styles.btnContainer}>

            <IconButton onClick={handleVideo} className={styles.icons} style={{color : "white"}}>
              {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton  onClick={handleCall} className={styles.icons}>
              <CallEndIcon style={{color : "red"}}/>
            </IconButton>
            <IconButton onClick={handleAudio} className={styles.icons} style={{color : "white"}}>
              {(audio === true) ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <IconButton onClick={handleScreen} className={styles.icons} style={{color: "white"}}>
              {(screenAvailable === true) ? 
                <ScreenShareIcon  />
                : 
                <StopScreenShareIcon />
              }
            </IconButton>

            <Badge badgeContent={newMessages} max={999} color="primary">
               <IconButton onClick={()=>setShowModal(!showModal)}  className={styles.icons}>
                  <ChatIcon style={{color : "white"}}/>
              </IconButton>
            </Badge>
            

          </div>
        
           <video className={styles.meetUserVideo} ref={localVideoRef} autoPlay muted></video>

              <div className={styles.conferenceView}>
  
                {videos.map((video)=>(

                    <div  key={video.socketId}>
                      
                      <video 

                        data-socket={video.socketId}
                        ref={ref => {
                          if(ref && video.stream){
                            ref.srcObject = video.stream;
                          }
                        }}
                        autoPlay
                      ></video>


                    </div>
                ))}

              </div>
        </div>
       }
    </div>
  )
}


