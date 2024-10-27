// createProject.js

import { projectSchema, ProjectModel } from "../model/project.model.js";
import express from "express";
import { z } from "zod";
import sendEmailNotifications from "../project/emailService.js";

const createProjectRouter = express.Router();

createProjectRouter.post("/api/admin/createproject", async (req, res) => {
  try {
    const validatedData = projectSchema.parse(req.body);
    const ProjectExists = await ProjectModel.findOne({
      projectCode: validatedData.projectCode,
    });

    if (ProjectExists) {
      return res.json({ message: "Project Already Exists" });
    } else {
      const newProject = new ProjectModel({
        ...validatedData,
      });
      await newProject.save();
      const projectAdmin = validatedData.projectAdmin;
      const adminEmail = projectAdmin.email;
      const adminName = projectAdmin.name; // Get admin name from the request

      await sendEmailNotifications(
        validatedData.projectInvestigators,
        validatedData.projectTitle,
        adminName,
        adminEmail
      );

      return res.status(201).json({
        message: "Project created successfully",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

export { createProjectRouter };
