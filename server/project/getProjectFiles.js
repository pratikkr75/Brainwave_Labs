import { ProjectModel } from "../model/project.model.js";
import express from "express";

const router = express.Router();

router.get("/api/admin/:projectCode/projectFiles", async (req, res) => {
  const { projectCode } = req.params;  // Get projectCode from URL parameter

  try {
    // Step 1: Find the specific project using projectCode
    const project = await ProjectModel.findOne({ projectCode })
      .select("projectReports")  // Only fetch the projectReports field
      .lean();  // Convert to plain JavaScript object

    // Step 2: Check if project exists
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Step 3: Transform file paths into frontend-friendly format
    const files = project.projectReports.map(filePath => ({
      fileName: filePath.split('/').pop(), // Get filename from path (e.g., "1730355667983-75160239.pdf")
      filePath: filePath  // Full path (e.g., "/files/1730355667983-75160239.pdf")
    }));

    // Step 4: Send response to frontend
    return res.status(200).json({
      success: true,
      files: files  // This matches the structure your frontend expects
    });

  } catch (error) {
    console.error("Error fetching project files:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch project files"
    });
  }
});

export { router as getProjectFiles };