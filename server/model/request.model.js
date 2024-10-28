import mongoose from 'mongoose';

const mongooseRequestSchema = new mongoose.Schema({
  investigatorEmail: {
    type: String,
    required: true,
  },
  adminEmail:{
    type: String,
    required:true
  },
  projectCode: {
    type: String,
    required: true,
  },
  fieldToUpdate: {
    type: String,
    required: true,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed, // Allows for mixed types (string, number, etc.)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  }
});



const RequestModel = mongoose.model('Request', mongooseRequestSchema);

export { RequestModel };
