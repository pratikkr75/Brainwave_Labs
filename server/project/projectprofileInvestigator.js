import {ProjectModel} from '../model/project.model.js';
import express from 'express';

const projectprofileInvestigator = express.Router();

projectprofileInvestigator.get('/api/investigator/project/:projectCode',async(req,res)=>{
    const { projectCode }  = req.params;
    const project = await ProjectModel.findOne({projectCode:projectCode});
    console.log(project);
    if(!project){
        return res.status(400).json({message:"No projects created"});
    }
    console.log(project);
    return res.status(200).json(project);
})
export {projectprofileInvestigator};