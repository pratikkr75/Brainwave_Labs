import multer from 'multer';
import mongoose from 'mongoose';
import { ProjectModel } from '../model/project.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let bucket;

// Initialize GridFS bucket
mongoose.connection.once('open', () => {
  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../temp-uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
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

// Upload middleware
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const projectCode = req.body.projectCode;
   
    if (!projectCode) {
      return res.status(400).json({ error: 'Project code is required' });
    }

    const project = await ProjectModel.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create a readable stream from the temporary file
    const readStream = fs.createReadStream(req.file.path);
    
    // Create a GridFS upload stream
    const filename = req.file.filename;
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        originalname: req.file.originalname,
        projectCode: req.body.projectCode,
        uploadDate: new Date(),
        uploadedBy: req.body.uploadedBy,
        role: req.body.role
      }
    });

    // Handle upload completion
    const handleUploadComplete = async (fileId) => {
      try {
        // Generate file URL and update project
        const fileUrl = `/files/${filename}`;
        project.projectReports.push(fileUrl);
        await project.save();

        // Delete temporary file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });

        return res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          fileUrl,
          file: {
            filename: filename,
            originalname: req.file.originalname,
            size: req.file.size,
            contentType: req.file.mimetype,
            uploadedBy: req.body.uploadedBy,
            role: req.body.role,
            id: fileId
          }
        });
      } catch (error) {
        console.error('Error in upload completion:', error);
        throw error;
      }
    };

    // Pipe the file to GridFS
    readStream
      .pipe(uploadStream)
      .on('error', (error) => {
        // Clean up temporary file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
        console.error('Upload Stream Error:', error);
        return res.status(500).json({
          success: false,
          error: 'File upload failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      })
      .on('finish', () => handleUploadComplete(uploadStream.id));

  } catch (error) {
    // Clean up temporary file in case of error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
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
    if (!bucket) {
      return res.status(500).json({ error: 'GridFS not initialized' });
    }

    const cursor = bucket.find({ filename: req.params.filename });
    const files = await cursor.toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];

    // Set appropriate headers
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Last-Modified', file.uploadDate.toUTCString());
    res.set('Content-Type', file.contentType);

    if (!file.contentType.startsWith('image/')) {
      res.set('Content-Disposition', `attachment; filename="${file.metadata.originalname}"`);
    }

    // Create read stream
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);

    // Error handling for the stream
    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ error: 'Error streaming file' });
    });

    // Pipe the file to the response
    downloadStream.pipe(res);

  } catch (error) {
    console.error('File serving error:', error);
    res.status(500).json({ error: 'Error serving file' });
  }
};

// Cleanup function for temporary files
const cleanup = () => {
  const uploadDir = path.join(__dirname, '../temp-uploads');
  if (fs.existsSync(uploadDir)) {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error('Error reading temp directory:', err);
        return;
      }
      files.forEach(file => {
        fs.unlink(path.join(uploadDir, file), err => {
          if (err) console.error('Error deleting temp file:', err);
        });
      });
    });
  }
};

// Clean up temporary files on process exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit();
});

export { upload, uploadFile, getFile };