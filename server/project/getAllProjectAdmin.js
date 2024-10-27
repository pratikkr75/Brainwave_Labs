import {ProjectModel} from '../model/project.model.js';
import express from 'express';

const getAllProjectAdmin = express.Router();

getAllProjectAdmin.get('/api/admin/getAllProjectsAdmin',async(req,res)=>{
    const {name,email} = req.query;
    const projects = await ProjectModel.find({'projectAdmin.name':name,'projectAdmin.email':email});

    if(!projects){
        return res.status(400).json({message:"No projects created"});
    }
    return res.status(200).json(projects);
})
export {getAllProjectAdmin};