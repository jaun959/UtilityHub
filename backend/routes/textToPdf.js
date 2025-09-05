
const router = require('express').Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;


// @route   POST /api/convert/text-to-pdf
// @desc    Convert text to PDF
// @access  Public
router.post('/text-to-pdf', async (req, res) => {
  const { text } = req.body;

  try {
    const doc = new PDFDocument();
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on('data', resolve);
      doc.on('end', () => resolve(doc.output));
      doc.on('error', reject);
    });

    doc.text(text);
    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    const uploadResult = await cloudinary.uploader.upload(`data:application/pdf;base64,${pdfBuffer.toString('base64')}`, {
      folder: 'utilityhub',
      resource_type: 'raw'
    });

    res.json({ path: uploadResult.secure_url });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
