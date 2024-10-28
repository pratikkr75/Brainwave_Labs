import { RequestModel } from '../model/request.model.js';
import express from 'express';

const adminRejectRequest = express.Router();

adminRejectRequest.post('/api/admin/rejectRequest', async (req, res) => {
    try {
        const { requestId } = req.body;
        // Check if request ID is provided
        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" });
        }
        // Find and delete the request
        const request = await RequestModel.findByIdAndUpdate(
            requestId,
            { status: "Declined" },
            { new: true }
        );
     
        // Check if the request was found and deleted
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Success response
        return res.status(200).json({ message: "Request rejected and deleted successfully", deletedRequest: request });
    } catch (err) {
        return res.status(500).json({ message: "An error occurred", error: err.message });
    }
});

export { adminRejectRequest };
