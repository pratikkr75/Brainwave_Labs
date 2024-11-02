import {ProjectModel} from '../model/project.model.js';
import { RequestModel } from '../model/request.model.js';
import { InvestigatorModel } from '../model/investigator.model.js';
import { AdminModel} from '../model/admin.model.js';
import express from 'express';

const adminpendingRequests = express.Router();

adminpendingRequests.get('/api/admin/pendingRequests',async(req,res)=>{
    try{
    const {adminEmail} = req.query;
    const requests = await RequestModel.find(adminEmail);
    return res.status(200).send(requests);
}catch(err){
    return res.status(500).json({ message: "An error occurred", error: err.message });
}
})
export {adminpendingRequests};