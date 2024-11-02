import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename, __dirname);
router.get('/api/admin/files/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
        const filePath = path.join(__dirname, '..', 'temp-uploads', filename);
    
        console.log('File path:', filePath);
    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(404).json({ error: 'File not found' });
      }
    });
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as fileServingRouter };