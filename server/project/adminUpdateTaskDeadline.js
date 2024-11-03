import { TaskModel } from "../model/task.model.js";
import express from "express";

const adminUpdateTaskDeadline = express.Router();

adminUpdateTaskDeadline.put('/api/admin/updateTaskDeadline/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { newDeadline} = req.body;
  
    try {
      // Find the task by ID and update the status
      const task = await TaskModel.findByIdAndUpdate(
        taskId,
        { dealine:newDeadline, requestStatus:"No"},
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

  export {adminUpdateTaskDeadline};