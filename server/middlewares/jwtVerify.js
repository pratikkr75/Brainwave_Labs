import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  try {
    // 1. Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2. Check if the header follows Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    //3. Extract the token (remove 'Bearer ' from the string)
    const token = authHeader.split(' ')[1];

    try {
      //4. Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      //5. Add the decoded admin information to the request object
      req.admin = decoded;
      
      //6. Proceed to the next middleware/route handler
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
