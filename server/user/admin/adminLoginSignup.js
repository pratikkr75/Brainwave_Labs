import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import {AdminModel, adminSchema} from '../../model/admin.model.js';
import dotenv from 'dotenv';

dotenv.config();

const adminSignupRouter = express.Router();
const adminLoginRouter = express.Router();

// JWT secret key from .env
const JWT_SECRET = process.env.JWT_SECRET;

// Login validation schema
const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

// admin signup Route
adminSignupRouter.post('/api/admin/signup', async (req, res) => {
  try {
    const validatedData = adminSchema.parse(req.body);

    const existingAdmin = await AdminModel.findOne({ email: validatedData.email });
    if (existingAdmin) {
      return res.redirect('/api/admin/login');
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newAdmin = new AdminModel({
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      email: validatedData.email,
      password: hashedPassword,
    });

    await newAdmin.save();
    return res.status(201).json({ 
      message: "Admin created successfully",
      redirect: '/api/admin/login'  // Include redirect URL in response
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// admin Login Route
adminLoginRouter.post('/api/admin/login', async (req, res) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    
    const admin = await AdminModel.findOne({ email: validatedData.email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password",error });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password",error });
    }

    // Generate JWT token for authorisation
    const token = jwt.sign(
      { 
        adminId: admin._id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );
    
    //returning jwt token after successful log in 
    return res.status(200).json({
      message: "Login successful",
        token: token,
        redirect: '/admin/api/console',  //  redirect URL to home page in response to redirect after successful login 
        admin: {
          id: admin._id,
          email: admin.email,
          firstname: admin.firstname,
          lastname: admin.lastname
      }
    });
  }catch(error){
 
      // If the error is not a Zod error, respond with a 400 status and the error details
      res.status(400).json({ message: 'Invalid email id or password', error });
  
}
});

export { adminSignupRouter, adminLoginRouter };