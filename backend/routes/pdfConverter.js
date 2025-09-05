
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const { poppler } = require('pdf-poppler');
const { PDFDocument } = require('pdf-lib');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'utilityhub',
    format: async (req, file) => 'pdf', // supports promises as well
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/convert/pdf-to-image
// @desc    Convert PDF to images
// @access  Public
router.post('/pdf-to-image', auth, authorize(['premium']), upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;

    // Download PDF from Cloudinary
    const response = await axios.get(file.path, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);

    // Save to a temporary local file for pdf-poppler
    const tempPdfPath = path.join(__dirname, '../uploads', `temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    const opts = {
      format: 'jpeg',
      out_dir: path.join(__dirname, '../uploads'),
      out_prefix: `converted-${Date.now()}`,
      page: null
    }

    await poppler.convert(tempPdfPath, opts);

    const files = fs.readdirSync(opts.out_dir).filter(f => f.startsWith(opts.out_prefix) && f.endsWith('.jpg'));
    const convertedFiles = [];

    for (const f of files) {
      const imagePath = path.join(opts.out_dir, f);
      const imageBuffer = fs.readFileSync(imagePath);

      const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${imageBuffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });

      convertedFiles.push({
        originalname: f,
        path: uploadResult.secure_url
      });
      fs.unlinkSync(imagePath); // Clean up temporary image file
    }

    fs.unlinkSync(tempPdfPath); // Clean up temporary PDF file

    res.json(convertedFiles);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   POST /api/convert/merge-pdfs
// @desc    Merge multiple PDFs into one
// @access  Public
router.post('/merge-pdfs', auth, authorize(['premium']), upload.array('pdfs'), async (req, res) => {
  try {
    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();
    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const pdfBuffer = Buffer.from(response.data);
      await merger.add(pdfBuffer);
    }

    const mergedPdfBuffer = await merger.saveAsBuffer();

    const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${mergedPdfBuffer.toString('base64')}`, {
      folder: 'utilityhub',
      resource_type: 'raw'
    });

    res.json({ path: uploadResult.secure_url });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/split-pdf
// @desc    Split a PDF into multiple pages
// @access  Public
router.post('/split-pdf', auth, authorize(['premium']), upload.single('pdf'), async (req, res) => {
  try {
    const { ranges } = req.body; // e.g. "1, 3-5, 8"
    const file = req.file;

    const response = await axios.get(file.path, { responseType: 'arraybuffer' });
    const existingPdfBytes = Buffer.from(response.data);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const newPdfDoc = await PDFDocument.create();

    const pageRanges = ranges.split(',').map(r => r.trim());
    for (const range of pageRanges) {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map(n => parseInt(n, 10));
        for (let i = start; i <= end; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i - 1]);
          newPdfDoc.addPage(copiedPage);
        }
      } else {
        const pageNum = parseInt(range, 10);
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
        newPdfDoc.addPage(copiedPage);
      }
    }

    const newPdfBytes = await newPdfDoc.save();

    const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${newPdfBytes.toString('base64')}`, {
      folder: 'utilityhub',
      resource_type: 'raw'
    });

    res.json({ path: uploadResult.secure_url });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
