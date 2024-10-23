import {ProjectModel} from '../model/project.model.js';
import express from 'express';

const getAllProjectInvestigator = express.Router();

getAllProjectInvestigator.get('/api/investigator/getAllProjects',async(req,res)=>{
    try{
    const {name,email} = req.query;
    console.log(name ,email);
  
    const projects = await ProjectModel.find({
        projectInvestigators: {
            $elemMatch: {
                name: name,
                email: email
            }
        }
    })
    if(!projects){
        return res.status(400).json({message:"No projects created"});
    }
    console.log(projects);
    return res.status(200).json(projects);
}catch(error){
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error getting projects' });
}
})

export {getAllProjectInvestigator};