import express from "express";

import {createServer} from "node:http";

import mongoose from "mongoose";

import cors from 'cors'

import dotenv from 'dotenv'

import {connectToSocket} from "./src/controllers/connectToSocket.js";

import router from "./src/routes/usres.routes.js";

dotenv.config({ path: './.env' })

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT));
app.use(cors());
app.use(express.json({limit : "40kb"}));
app.use(express.urlencoded({extended: true, limit : "40kb"}));

app.use("/api/v1/user", router);


app.get("/home", (req, res)=>{
   return res.json({"hello" : "keshav"});
});


const start = async ()=>{

    const dbConnection = await mongoose.connect(process.env.MONGO_URL);
    console.log("db connected");

    server.listen(app.get("port"), ()=>{
        console.log(`server is running on port ${app.get("port")}`);
    });

}

start();