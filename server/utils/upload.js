// upload.js
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';
import { ProjectModel } from '../model/project.model.js';
import Grid from 'gridfs-stream';
import dotenv from 'dotenv';

dotenv.config();

// Construct MongoDB URL based on environment variables
const DB_PASSWORD = process.env.DB_PASSWORD;
const mongoURL = process.env.MONGO_URI;
let gfs;

mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// GridFS Storage Setup with error handling
const storage = new GridFsStorage({
  url: mongoURL,
  options: { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Check file type
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return reject(new Error('File type not supported'));
      }

      // Create filename with original extension
      const originalName = file.originalname;
      const fileExtension = originalName.split('.').pop();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;

      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
        metadata: {
          originalname: file.originalname,
          projectCode: req.body.projectCode,
          uploadDate: new Date(),
          uploadedBy: req.body.uploadedBy, // New metadata field for uploader's name or ID
          role: req.body.role // New metadata field for uploader's role
        }
      };

      resolve(fileInfo);
    });
  }
});

// Error handling for storage
storage.on('connectionError', function(err) {
  console.error('GridFS Storage Connection Error:', err);
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Maximum 1 file per request
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'), false);
      return;
    }
    cb(null, true);
  }
});

// Middleware for uploading files
const uploadFile = async (req, res) => {
  const projectCode = req.body.projectCode;

  try {
    if (!projectCode) {
      return res.status(400).json({ error: 'Project code is required' });
    }

    // Find the project by its project code
    const project = await ProjectModel.findOne({ projectCode });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate file URL
    const fileUrl = `/files/${req.file.filename}`;

 
    
    project.projectReports.push(fileUrl);
    await project.save();

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        id: req.file.id,
        size: req.file.size,
        contentType: req.file.contentType,
        uploadedBy: req.body.uploadedBy, // Return uploadedBy info in response
        role: req.body.role // Return role info in response
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during file upload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// File serving middleware
const getFile = async (req, res) => {
  try {
    if (!gfs) {
      return res.status(500).json({ error: 'Grid FS not initialized' });
    }

    const file = await gfs.files.findOne({ filename: req.params.filename });
    
    if (!file || file.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers for browser caching
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.set('Last-Modified', file.uploadDate.toUTCString());

    // Handle different file types
    if (file.contentType.startsWith('image/')) {
      res.set('Content-Type', file.contentType);
      const readStream = gfs.createReadStream({ filename: file.filename });
      readStream.pipe(res);
    } else {
      res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `attachment; filename="${file.metadata.originalname}"`);
      const readStream = gfs.createReadStream({ filename: file.filename });
      readStream.on('error', (err) => {
        console.error('Read stream error:', err);
        res.status(500).json({ error: 'Error streaming file' });
      });
      readStream.pipe(res);
    }
  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'Error serving file' });
  }
};

export { upload, uploadFile, getFile };
