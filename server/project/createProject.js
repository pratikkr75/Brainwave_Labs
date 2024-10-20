import {projectSchema,ProjectModel} from '../model/project.model.js';
import express from 'express';
import {z} from 'zod';

const createProjectRouter = express.Router();

createProjectRouter.post('/api/admin/creatproject',async(req,res)=>{
    try{
         const validatedData = projectSchema.parse(req.body);
         const ProjectExists = await ProjectModel.findOne({projectCode:validatedData.projectCode});
         if(ProjectExists){
            res.json({message:"Project Already Exists"});
         }
         else {
            const newProject = new ProjectModel({
                ...validatedData
            })
            await newProject.save();
            return res.status(201).json({ 
                message: "Project created successfully",
              });
         }
    }catch(error){
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
          }
      
          // 7. Handle other errors
          return res.status(500).json({ message: "An error occurred", error: error.message });
    }
})

export  {createProjectRouter};
