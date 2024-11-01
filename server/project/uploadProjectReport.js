// uploadProjectReport.js

import express from "express";
import { ProjectModel } from "../model/project.model.js";
import { upload, uploadFile } from "../utils/upload.js";

const uploadProjectReport = express.Router();

// Route for handling project report uploads
uploadProjectReport.post(
  "/api/admin/project/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { projectCode } = req.body;

      // Check if the project exists
      const project = await ProjectModel.findOne({ projectCode });
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Generate file URL and add to projectReports field
      const fileUrl = `/files/${req.file.filename}`;
      project.projectReports.push(fileUrl);

      // Save the updated project document
      await project.save();

      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        fileUrl,
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          id: req.file.id,
          size: req.file.size,
          contentType: req.file.contentType,
          uploadedBy: req.body.uploadedBy,
          role: req.body.role,
        },
      });
    } catch (error) {
      console.error("File upload failed:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred during file upload",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

export { uploadProjectReport };
