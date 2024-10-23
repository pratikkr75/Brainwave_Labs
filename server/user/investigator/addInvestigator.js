import { InvestigatorModel } from '../../model/investigator.model.js';
import {ProjectModel} from '../../model/project.model.js';

import express from 'express';

const addInvestigator = express.Router();

addInvestigator.post('/api/admin/addInvestigator',async(req,res)=>{
   
    try {
        const { projectCode, firstname, lastname, email } = req.body;
        const query = { projectCode: projectCode };
        const project = await ProjectModel.findOne(query);
        const emailexist = await InvestigatorModel.findOne({email:email});
        
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        if(!emailexist){
            return res.status(400).json({message : 'Investigator not found'})
        }
        project.projectInvestigators.push({
          name: `${firstname} ${lastname}`, 
          email: email,
        });
        await project.save();
    
        res.status(201).json({ message: 'Investigator added successfully', project });
      } catch (error) {
        console.error('Error adding investigator:', error);
        res.status(500).json({ message: 'Error adding investigator' });
      }
    });
export {addInvestigator};