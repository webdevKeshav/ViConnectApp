import {User} from "../models/User.js";
import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt";
import crypto from "crypto";
import Meeting from "../models/Meeting.js";

const login = async (req, res)=>{
    try {
    let {username, password} = req.body;

    if(!username || !password)return res.json({message : "please give correct details"});

    let user = await User.findOne({username});
    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({message : "user not found please register fist"});
    }


    if(await bcrypt.compare(password, user.password)){
       let token = crypto.randomBytes(20).toString("hex");
       user.token = token;

       await user.save();

       return res.status(httpStatus.OK).json({message : `loged in succesfully ${token}`});
    }
    
    return res.status(httpStatus.NOT_ACCEPTABLE).json({message : "wrong password"});

   }catch(e){
    res.json({message : `someting went wrong ${e}`});
   }

}


const register = async (req, res)=>{
    const {name , username, password} = req.body;
    try {
        const user = await User.findOne({username});
        if(user){
            return res.status(httpStatus.FOUND).json({message : "user already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name : name,
            username : username,
            password : hashedPassword
        });
        await newUser.save();
        
        res.status(httpStatus.CREATED).json({message : "user created sucessfully"});

    } catch (error) {
        res.json({ message :`somting went wrong ${error}`});
    }
}


const getUserHistory = async(req, res)=>{
    const {token} = req.params;

    try {
        const user = await User.findOne({token : token});
        const meetings = await Meeting.find({user_id:user.username})
        res.json(meetings);
    } catch (e) {
        res.json({message : `kuch to gadbad ha daya something went wrong ${e}`});
    }
}    

const addToHistory = async (req, res)=>{
    const {token,  meeting_code} = req.body;
    try {
        const user = await User.findOne({token : token});
        const newMeeting = new Meeting({
            user_id : user.username,
            meetingCode : meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({message:"Added to History"});

    } catch (error) {
        res.json({message : `something went wrong ${error}`});
    }
}


export {login, register, getUserHistory, addToHistory};