import {ProjectModel} from '../model/project.model.js';
import { RequestModel } from '../model/request.model.js';
import { InvestigatorModel } from '../model/investigator.model.js';
import { AdminModel} from '../model/admin.model.js';
import express from 'express';

const investigatorProjectRequest = express.Router();

investigatorProjectRequest.post('/api/investigator/project/request',async(req,res)=>{
    try{
    const { projectCode,investigatorEmail,fieldToUpdate, newValue,message}  = req.body;
    const project = await ProjectModel.findOne({projectCode:projectCode});
    const investigator = await InvestigatorModel.findOne({email:investigatorEmail});
    if(!project || !investigator|| !newValue){
        return res.status(400).json({message:"Invalid Request"});
    }
    const adminEmail = project.projectAdmin.email;

    const newRequest = new RequestModel({
        investigatorEmail,
        adminEmail,
        projectCode,
        fieldToUpdate,
        newValue,
        message
      });
      console.log(newRequest);
      await newRequest.save();
    return res.status(200).json({
         message:"Request sent succesfully to admin",
    });
}catch(err){
    return res.status(500).json({ message: "An error occurred", error: err.message });
}
})
export {investigatorProjectRequest};