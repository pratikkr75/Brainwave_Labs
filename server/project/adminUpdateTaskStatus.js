import { TaskModel } from "../model/task.model.js";
import express from "express";

const adminUpdateTaskStatus = express.Router();

adminUpdateTaskStatus.put('/api/admin/updateTaskStatus/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { status} = req.body;
  
    try {
      // Find the task by ID and update the status
      const task = await TaskModel.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }  // This option returns the updated document
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

  export {adminUpdateTaskStatus};