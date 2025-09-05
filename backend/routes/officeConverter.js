
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'utilityhub',
    format: async (req, file) => {
      const ext = path.extname(file.originalname).substring(1);
      return ext === 'doc' || ext === 'docx' ? 'docx' : ext; // Handle docx for docx-pdf
    },
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/convert/word-to-pdf
// @desc    Convert Word to PDF
// @access  Public
router.post('/word-to-pdf', auth, authorize(['premium']), upload.single('doc'), async (req, res) => {
  try {
    const file = req.file;
    // Placeholder for Word to PDF conversion
    console.log('Word to PDF conversion requested for:', file.originalname);
    res.json({ message: 'Word to PDF conversion is a placeholder. No actual conversion performed.', path: 'placeholder.pdf' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   POST /api/convert/pdf-to-word
// @desc    Convert PDF to Word (Placeholder)
// @access  Public
router.post('/pdf-to-word', auth, authorize(['premium']), upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    // Placeholder for PDF to Word conversion
    // In a real application, you would integrate with an external API or a local library
    console.log('PDF to Word conversion requested for:', file.originalname);
    res.json({ message: 'PDF to Word conversion is a placeholder. No actual conversion performed.', path: 'placeholder.docx' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/excel-to-pdf
// @desc    Convert Excel to PDF (Placeholder)
// @access  Public
router.post('/excel-to-pdf', auth, authorize(['premium']), upload.single('excel'), async (req, res) => {
  try {
    const file = req.file;
    // Placeholder for Excel to PDF conversion
    console.log('Excel to PDF conversion requested for:', file.originalname);
    res.json({ message: 'Excel to PDF conversion is a placeholder. No actual conversion performed.', path: 'placeholder.pdf' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/pdf-to-excel
// @desc    Convert PDF to Excel (Placeholder)
// @access  Public
router.post('/pdf-to-excel', auth, authorize(['premium']), upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    // Placeholder for PDF to Excel conversion
    console.log('PDF to Excel conversion requested for:', file.originalname);
    res.json({ message: 'PDF to Excel conversion is a placeholder. No actual conversion performed.', path: 'placeholder.xlsx' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
