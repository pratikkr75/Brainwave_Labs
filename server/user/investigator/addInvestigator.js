import {ProjectModel} from '../../model/project.model.js';


import express from 'express';


const addInvestigator = express.Router();

addInvestigator.post('/api/admin/addInvestigator/:projectCode',async(req,res)=>{
   
    try {
        const projectCode = req.params.projectCode;
        const investigator = req.body;
        console.log(investigator);
        console.log(projectCode);
        const project = await ProjectModel.findOne({projectCode});
        console.log(project);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
    
        project.projectInvestigators.push({
          name: investigator.firstname,
          email: investigator.email,
        });
    
        await project.save();
    
        res.status(201).json({ message: 'Investigator added successfully', project });
      } catch (error) {
        console.error('Error adding investigator:', error);
        res.status(500).json({ message: 'Error adding investigator' });
      }
    });
export {addInvestigator};