import { ProjectModel } from "../model/project.model.js";
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Get GridFS bucket instance
let bucket;
mongoose.connection.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

// Get list of project files with metadata
router.get("/api/admin/:projectCode/projectFiles", async (req, res) => {
  const { projectCode } = req.params;

  try {
    // Find the project by projectCode
    const project = await ProjectModel.findOne({ projectCode }).select(
      "projectReports"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Get file URLs from the project
    const fileUrls = project.projectReports || [];

    // Get detailed file information from GridFS
    const fileDetails = await Promise.all(
      fileUrls.map(async (fileUrl) => {
        // Extract filename from fileUrl (removes '/files/' prefix)
        const filename = fileUrl.replace("/files/", "");

        try {
          // Find file in GridFS
          const cursor = bucket.find({ filename });
          const files = await cursor.toArray();

          if (files && files.length > 0) {
            const file = files[0];
            return {
              fileUrl,
              filename: file.filename,
              originalname: file.metadata?.originalname,
              uploadDate: file.uploadDate,
              size: file.length,
              contentType: file.contentType,
              uploadedBy: file.metadata?.uploadedBy,
              role: file.metadata?.role,
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching file details for ${filename}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values (files that weren't found)
    const validFiles = fileDetails.filter((file) => file !== null);

    // Prepare the response
    const projectFiles = {
      projectReports: validFiles,
      totalFiles: validFiles.length,
    };

    return res.status(200).json({
      success: true,
      files: projectFiles,
    });
  } catch (error) {
    console.error("Error fetching project files:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export { router as getProjectFiles };
