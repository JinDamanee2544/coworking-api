
const Appointment = require('../models/appointment');
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
            path:'hospotal',
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
}
exports.addAppointment=async(req,res,next)=>{
    try{
        req.body.space = req.params.spaceId;
        const space= await Space.findById(req.params.spaceId)
        if(!space){
            return res.status(404).json({success:false,message:`No space with the id of ${req.params.spaceId}`})
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
}
exports.updateAppointment=async(req,res,next)=>{
    try{
        let appointment= await Appointment.findById(req.params.id);
        req.body.space = req.params.spaceId;
        const space= await Space.findById(req.params.spaceId)
        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`})
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