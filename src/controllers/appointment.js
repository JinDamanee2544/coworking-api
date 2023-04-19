
const Appointment = require('../models/appointment');
const Space = require('../models/space');
const {isTimeBetween,isOverlap} = require('../utils/index')
exports.getAppointments = async(req,res,next)=>{
    let query;
    if(req.user.role!=='admin'){
        query=Appointment.find({user:req.user.id}).populate({
            path:'space',
            select:'name province tel'
        })
    }
    else{
        query=Appointment.find().populate({
            path:'space',
            select:'name province tel'
        });
    }
    try{
        const appointments = await query;
        res.status(200).json({
            success:true,
            count:appointments.length,
            data:appointments
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Appointment"})
    }
};
exports.getAppointment = async(req,res,next)=>{
    try{
        const appointment= await Appointment.findById(req.params.id).populate({
            path:'space',
            select:'name description tel'
        });
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointments with the id of ${req.params.id}`})
        }
        res.status(200).json({
            success:true,
            data:appointment
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot find appointment"})
    }
};
exports.addAppointment=async(req,res,next)=>{
    try{
        req.body.space = req.params.spaceId;
        const space= await Space.findById(req.params.spaceId)
        if(!space){
            return res.status(404).json({success:false,message:`No space with the id of ${req.params.spaceId}`})
        }
        if(req.body.startTime>req.body.endTime){
            return res.status(400).json({success:false,message:"You can only reserve start time before end time"});
        }
        if(!isTimeBetween(space.startTime,space.endTime,req.body.startTime,req.body.endTime)){
            return res.status(400).json({success:false,message:"You can only reserve time when Co-Working space is open"});
        }
        req.body.user=req.user.id;
        const existedAppointments = await Appointment.find({user:req.user.id});
        if(existedAppointments.length>=3&&req.user.role!=='admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 appointments`})
        }
        const allAppointments = await Appointment.find();
        for(let i=0;i<allAppointments.length;i++){
            if(allAppointments[i].apptDate == req.body.apptDate&&allAppointments[i].space == req.body.space &&isOverlap(req.body.startTime,req.body.endTime,allAppointments[i].startTime,allAppointments[i].endTime)){
                return res.status(400).json({success:false,message:'Cannot reserve with time overlap to other appointments'});
            }
        }
        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success:true,
            data:appointment
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot create appointment"})
    }
};
exports.updateAppointment=async(req,res,next)=>{
    try{
        let appointment= await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`})
        }
        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this appointment`})
        }
        if(req.body.startTime>req.body.endTime){
            return res.status(400).json({success:false,message:"You can only reserve start time before end time"});
        }
        if(!isTimeBetween(space.startTime,space.endTime,req.body.startTime,req.body.endTime)){
            return res.status(400).json({success:false,message:"You can only reserve time when Co-Working space is open"});
        }
        const allAppointments = await Appointment.find();
        for(let i=0;i<allAppointments.length;i++){
            if(allAppointments[i]!==appointment &&allAppointments[i].apptDate == req.body.apptDate&&allAppointments[i].space == req.body.space &&isOverlap(req.body.startTime,req.body.endTime,allAppointments[i].startTime,allAppointments[i].endTime)){
                return res.status(400).json({success:false,message:'Cannot reserve with time overlap to other appointments'});
            }
        }
        appointment=await Appointment.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).json({
            success:true,
            data:appointment
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot update appointment"})
    }
}
exports.deleteAppointment=async(req,res,next)=>{
    try{
        const appointment=await Appointment.findById(req.params.id);
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`})
        }
        if(appointment.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this bootcamp`})
        }
        await appointment.remove();
        res.status(200).json({
            success:true,
            data:{}
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Cannot delete appointment"})
    }
}