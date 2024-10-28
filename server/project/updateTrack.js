// updateTrack.js
import { projectSchema, ProjectModel } from "../model/project.model.js";
import express from "express";

const updateTrackRouter = express.Router();

updateTrackRouter.put(
  "/api/admin/console/project/updateTrack/:projectCode",
  async (req, res) => {
    try {
      const { projectCode } = req.params;
      const { trackProgress, projectCompledted } = req.body;

      // Ensure the request has admin rights
      if (!req.admin) {
        return res
          .status(401)
          .json({ message: "Admin authentication required" });
      }

      const project = await ProjectModel.findOne({ projectCode });
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Update only tracking-related fields
      project.trackProgress = trackProgress;
      project.projectCompledted = projectCompledted;
      await project.save();

      res
        .status(200)
        .json({ message: "Track progress updated successfully", project });
    } catch (error) {
      console.error("Error updating track:", error);
      res
        .status(500)
        .json({
          message: "Failed to update track progress",
          error: error.message,
        });
    }
  }
);

export const updateTrack = updateTrackRouter;
