const mongoose=require('mongoose');
const validator = require("validator");

const AppointmentSchema = new mongoose.Schema({
    apptDate:{
        type:Date,
        required:[true,"Please provide an appoint date"]
    },
    startTime:{
        type:String,
        require:[true,"Please provide a start time"],
        validator: [validator.isTime, "Please provide a valid time"],
    },
    endTime:{
        type:String,
        require:[true,"Please provide an end time"],
        validator: [validator.isTime, "Please provide a valid time"],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    space:{
        type:mongoose.Schema.ObjectId,
        ref:'Space',
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});
module.exports=mongoose.model('Appointment',AppointmentSchema);