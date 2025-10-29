import mongoose from 'mongoose';

let schema = mongoose.Schema;

let meetingSchema = new schema({
    userId : {
        type : String,
    },
    meetingCode : {
        type : String, 
        required : true,
    },
    date : {
        type : Date,
        default : Date.now,
        required : true,
    },
});

let Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;