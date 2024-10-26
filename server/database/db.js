import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_PASSWORD = process.env.DB_PASSWORD; 
const DB_URI = `mongodb+srv://brainwave76:${DB_PASSWORD}@cluster0.wooai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 const URI = process.env.MONGO_URI;
const Connection = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Error while connecting to database", err);
    }
};

export default Connection;