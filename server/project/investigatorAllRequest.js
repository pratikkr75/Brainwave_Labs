import { RequestModel } from '../model/request.model.js';
import express from 'express';

const investigatorAllRequest = express.Router();

investigatorAllRequest.get('/api/investigator/pendingRequests',async(req,res)=>{
    try{
    const {investigatorEmail} = req.query;
    console.log(investigatorEmail);
    const requests = await RequestModel.find(investigatorEmail);
    console.log(requests);
    return res.status(200).send(requests);
}catch(err){
    return res.status(500).json({ message: "An error occurred", error: err.message });
}
})
export {investigatorAllRequest};