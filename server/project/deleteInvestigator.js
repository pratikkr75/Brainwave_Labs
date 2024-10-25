import { ProjectModel } from '../model/project.model.js';
import express from 'express';

const deleteInvestigator = express.Router();

deleteInvestigator.post('/api/admin/project/deleteInvestigator', async (req, res) => {
  const { projectCode, name, email } = req.body; // Get data from the request body
  console.log(projectCode, name, email);
  if (!projectCode || !name || !email) {
    return res.status(400).json({ message: "Please provide projectCode, name, and email." });
  }

  try {
    // Find the project by projectCode
    const project = await ProjectModel.findOne({ projectCode });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if there is at least one investigator
    if (project.projectInvestigators.length === 1) {
      return res.status(400).json({ message: "Project should have atleast one Investigator" });
    }

    // Find the index of the investigator to delete
    const investigatorIndex = project.projectInvestigators.findIndex(
      (inv) => inv.name === name && inv.email === email
    );

    if (investigatorIndex === -1) {
      return res.status(404).json({ message: "Investigator not found." });
    }

    // Remove the investigator from the array
    project.projectInvestigators.splice(investigatorIndex, 1);

    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Investigator deleted successfully.", project });
  } catch (error) {
    console.error("Error deleting investigator:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { deleteInvestigator };
