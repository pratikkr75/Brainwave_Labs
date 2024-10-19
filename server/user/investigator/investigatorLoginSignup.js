import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
<<<<<<< HEAD
import InvestigatorModel from './model/investigator.model.js'; 
import investigatorSchema from './model/investigator.model.js'; 
=======
import {InvestigatorModel, investigatorSchema} from '../../model/investigator.model.js'; 
>>>>>>> second-branch

dotenv.config(); 

//JWT secret key from .env
const JWT_SECRET = process.env.JWT_SECRET; 

const investigatorSignupRouter = express.Router();
const investigatorLoginRouter = express.Router();

// Login validation schema
const investigatorLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be less than 100 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

// Investigator signup Route
investigatorSignupRouter.post('/api/investigator/signup', async (req, res) => {
  try {
    // 1. Validating the incoming request body against the schema defined using zod
    const validatedData = investigatorSchema.parse(req.body);

    // 2. Checking for existing user
    const existingInvestigator = await InvestigatorModel.findOne({ email: validatedData.email });
    if (existingInvestigator) {
      // 3. Redirect to the login route if the email already exists
      return res.redirect('/api/investigator/login');
    }

    // 4. Hashing password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // 5. Creating a new investigator
    const newInvestigator = new InvestigatorModel({
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      email: validatedData.email,
      password: hashedPassword,
    });

    await newInvestigator.save();
    return res.status(201).json({ 
      message: "Investigator created successfully",
      redirect: '/api/investigator/login'  // Include redirect URL in response
    });
  } catch (error) {
    // 6. Handling errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // 7. Handle other errors
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Investigator Login Route
investigatorLoginRouter.post('/api/investigator/login', async (req, res) => {
  try {
    // 1. Validating login data
    const validatedData = investigatorLoginSchema.parse(req.body);

    // 2. Finding investigator by email
    const investigator = await InvestigatorModel.findOne({ email: validatedData.email });
    if (!investigator) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Comparing passwords
    const isPasswordValid = await bcrypt.compare(validatedData.password, investigator.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate JWT token for the investigator
    const token = jwt.sign(
      {
        investigatorId: investigator._id,
        email: investigator.email,
        firstname: investigator.firstname,
        lastname: investigator.lastname
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token valid for 24 hours
    );

    // 5. Send the token along with user info
    return res.status(200).json({
      message: "Login successful",
      token, // Send the JWT token in the response
      redirect: '/investigator/home',  //  redirect URL to home page in response to redirect after successful login
      investigator: {
        id: investigator._id,
        email: investigator.email,
        firstname: investigator.firstname,
        lastname: investigator.lastname
      }
    });

  } catch (error) {
    // 6. Handling errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle other errors
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

export { investigatorSignupRouter, investigatorLoginRouter };
