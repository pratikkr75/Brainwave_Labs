import { projectSchema, ProjectModel } from "../model/project.model.js";
import express from "express";

const updateProjectRouter = express.Router();

const compareAndGetChanges = (oldData, newData) => {
  const changes = {};

  // Helper function to compare objects recursively
  const compareObjects = (oldObj, newObj, path = "") => {
    // Handle arrays specially (like projectInvestigators)
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      if (JSON.stringify(oldObj) !== JSON.stringify(newObj)) {
        changes[path.slice(1)] = newObj;
      }
      return;
    }

    for (const key in newObj) {
      const newPath = path ? `${path}.${key}` : `.${key}`;

      // Skip if key doesn't exist in old data
      if (!(key in oldObj)) continue;

      if (
        typeof newObj[key] === "object" &&
        newObj[key] !== null &&
        typeof oldObj[key] === "object" &&
        oldObj[key] !== null
      ) {
        // Recursively compare nested objects
        compareObjects(oldObj[key], newObj[key], newPath);
      } else if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
        // Store only changed values
        changes[newPath.slice(1)] = newObj[key];
      }
    }
  };

  compareObjects(oldData, newData);
  return changes;
};

updateProjectRouter.put("/api/admin/project/:projectCode", async (req, res) => {
  try {
    const { projectCode } = req.params;
    const updates = req.body;

    // Fetch existing project
    const existingProject = await ProjectModel.findOne({ projectCode });
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Convert mongoose document to plain object for comparison
    const existingData = existingProject.toObject();

    // Get only the changed fields
    const changedFields = compareAndGetChanges(existingData, updates);

    // If no changes detected
    if (Object.keys(changedFields).length === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes detected",
        data: existingProject,
      });
    }

    // Validate the complete updated project against schema
    const validationResult = projectSchema.safeParse({
      ...existingData,
      ...updates,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    // Update only changed fields using $set
    const updatedProject = await ProjectModel.findOneAndUpdate(
      { projectCode },
      { $set: changedFields },
      {
        new: true, // Return updated document
        runValidators: true, // Run mongoose validations
      }
    );

    // Log the changes for audit purposes
    console.log(
      `Project ${projectCode} updated. Changed fields:`,
      changedFields
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
      changedFields: changedFields,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating project",
      error: error.message,
    });
  }
});

export const updateProject = updateProjectRouter;
