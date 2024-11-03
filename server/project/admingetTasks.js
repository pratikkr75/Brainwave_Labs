import { TaskModel } from "../model/task.model.js";
import express from "express";

const admingetTasks= express.Router();

admingetTasks.get("/api/admin/getTasks/:projectCode", async (req, res) => {
  try {
    const {projectCode} = req.params;
    const Tasks = await TaskModel.find({projectCode:projectCode});
   
     return res.status(200).send(Tasks);
  } catch (error) {
  
    return res
      .status(500)
      .json({ message: "An error occurred", error: error });
  }
});

export { admingetTasks };
