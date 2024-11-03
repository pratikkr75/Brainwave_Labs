import { TaskModel } from "../model/task.model.js";
import express from "express";

const adminpostTask= express.Router();

adminpostTask.post("/api/admin/postTask", async (req, res) => {
  try {
    const {projectCode,taskDetails,deadline} = req.body;
    console.log(taskDetails);
     const newTask = new TaskModel({
        projectCode,
        taskDetails,
        deadline
     })
     console.log(newTask);
     await newTask.save();
     return res.status(200).json({message:"New Task added to the project"});
  } catch (error) {
  
    return res
      .status(500)
      .json({ message: "An error occurred", error: error });
  }
});

export { adminpostTask };
