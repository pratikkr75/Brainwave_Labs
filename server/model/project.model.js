import mongoose from 'mongoose';
import { z } from 'zod';

const projectSchema = z.object({
  projectCode: z.string().min(1, "Project code is required").nonempty(),
  projectTitle: z.string().min(1, "Project title is required"),
  projectAdmin: z.object({
    name: z.string().min(1, "Admin name is required"),
    email: z.string().email("Admin email must be valid")
  }),
  projectInvestigators: z.array(z.object({
    name: z.string().min(1, "Investigator name is required"),
    email: z.string().email("Investigator email must be valid")
  })),
  projectStartDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  projectEndDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  projectDuration: z.number().positive("Project duration must be positive"),
  projectReports: z.array(z.string()).optional(),
  financialReport: z.array(z.string()).optional(),  
  projectTrack: z.string().optional(),     
  projectBankDetails: z.object({
    accountNumber: z.string().min(1, "Account number is required"),
    IFSC_Code: z.string().min(1, "IFSC code is required")
  }),
  projectBudget: z.number().positive("Project budget must be a positive number"),
  
});


const mongooseProjectSchema = new mongoose.Schema({
  projectCode: {
    type: String,
    required: true,
    unique: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  projectAdmin: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  projectInvestigators: [
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    }
  ],
  projectStartDate: {
    type: Date,
    required: true
  },
  projectEndDate: {
    type: Date,
    required: true
  },
  projectDuration: {
    type: Number,  
    required: true
  },
  projectReports: {
    type: [String],
    required: false
  },
  financialReport: {
    type: [String],
    required: false
  },  
  projectTrack: {
    type: String, 
    required: false
  },
  projectBankDetails: {
    accountNumber: {
      type: String,
      required: true
    },
    IFSC_Code: {
      type: String,
      required: true
    }
  },
  projectBudget: {
    type: Number,
    required: true
  },
  projectCompledted:{
    type:String,
    default:"false",
    required : true
  }
}, { timestamps: true });

const ProjectModel = mongoose.model('Project', mongooseProjectSchema);




export {ProjectModel, projectSchema}

