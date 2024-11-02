import { RequestModel } from '../model/request.model.js';
import { ProjectModel } from '../model/project.model.js';
import express from 'express';

const adminAcceptRequest = express.Router();

adminAcceptRequest.put('/api/admin/acceptRequest', async (req, res) => {
    try {
        const { projectCode, fieldToUpdate, newValue, requestId } = req.body;

        // Check if required fields are provided
        if (!projectCode || !fieldToUpdate || !newValue || !requestId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Update the specific field in the Project model
        const project = await ProjectModel.findOneAndUpdate(
            { projectCode: projectCode },                 // Assuming `code` is the unique identifier for projects
            { [fieldToUpdate]: newValue },          // Dynamically updates the specified field
            { new: true }                           // Returns the updated document
        );

        // Check if the project was found and updated
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Update the status of the request to "Accepted"
        const request = await RequestModel.findByIdAndUpdate(
            requestId,
            { status: "Accepted" },
            { new: true }
        );

        // Check if the request was found and updated
        if (!request) {
            return res.status(404).json({ message: "Request not found for status update" });
        }

        // Success response
        return res.status(200).json({ 
            message: "Request accepted and project updated successfully", 
            updatedProject: project, 
            updatedRequest: request 
        });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
});

export { adminAcceptRequest };
