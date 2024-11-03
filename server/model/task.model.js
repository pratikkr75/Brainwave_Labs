import mongoose from 'mongoose';

const mongooseTaskSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    required: true,
  },
  taskDetails: {
    type: String,
    required: true,
  },
  deadline:{
    type:Date,
    required:true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Missed'],
    default: 'Pending',
  },
  requestStatus: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No',
  },
  requestedDeadline: {
    type: Date,
    required:false
  }
});



const TaskModel = mongoose.model('Task', mongooseTaskSchema);

export { TaskModel };
