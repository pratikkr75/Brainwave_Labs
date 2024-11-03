import { TaskModel } from "../model/task.model.js";
import express from "express";

const investigatorRequestDeadline = express.Router();

investigatorRequestDeadline.put('/api/investigator/requestTaskDeadline/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { requestedDeadline, requestStatus } = req.body; 

    try {
       
        const task = await TaskModel.findByIdAndUpdate(
            taskId,
            { requestedDeadline, requestStatus }, 
            { new: true }  
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({
            message: 'Task status updated successfully',
            task
        });
    } catch (err) {
        console.error('Error updating task status:', err);
        res.status(500).json({
            message: 'An error occurred while updating the task status',
            error: err.message
        });
    }
});

export { investigatorRequestDeadline };
