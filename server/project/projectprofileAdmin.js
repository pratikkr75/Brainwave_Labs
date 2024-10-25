import {ProjectModel} from '../model/project.model.js';
import express from 'express';

const projectprofileAdmin = express.Router();

projectprofileAdmin.get('/api/admin/project/:projectCode',async(req,res)=>{
    const { projectCode }  = req.params;
    console.log(projectCode);
    const project = await ProjectModel.findOne({projectCode:projectCode});

    if(!project){
        return res.status(400).json({message:"No projects created"});
    }
    console.log(project);
    return res.status(200).json(project);
})
export {projectprofileAdmin};