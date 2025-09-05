
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const PDFDocument = require('pdfkit');
const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/convert/png-to-jpg
// @desc    Convert PNG images to JPG
// @access  Public
router.post('/png-to-jpg', upload.array('images'), async (req, res) => {
  try {
    const convertedFiles = [];
    for (const file of req.files) {
      const imageBuffer = file.buffer;

      // Process with sharp
      const jpgBuffer = await sharp(imageBuffer).jpeg().toBuffer();

      // Upload to Supabase Storage
      const fileName = `converted-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, jpgBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      convertedFiles.push({
        originalname: fileName,
        path: publicUrlData.publicUrl
      });
    }
    res.json(convertedFiles);
  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});


// @route   GET /api/convert/download-image/:filename
// @desc    Download a converted image
// @access  Public
router.get('/download-image/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const { data, error } = await supabase.storage.from('utilityhub').download(filename);

    if (error) {
      throw error;
    }

    res.set('Content-Type', data.type);
    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;


// @route   POST /api/convert/image-to-pdf
// @desc    Convert images to PDF
// @access  Public
router.post('/image-to-pdf', upload.array('images'), async (req, res) => {
  try {
    const pdfDoc = new PDFDocument();
    const pdfBufferPromise = new Promise((resolve, reject) => {
      pdfDoc.on('data', resolve);
      pdfDoc.on('end', () => resolve(pdfDoc.output));
      pdfDoc.on('error', reject);
    });

    for (const file of req.files) {
      const imageBuffer = file.buffer;

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      pdfDoc.addPage({ size: [metadata.width, metadata.height] });
      pdfDoc.image(imageBuffer, 0, 0, { width: metadata.width, height: metadata.height });
    }

    pdfDoc.end();

    const pdfBuffer = await pdfBufferPromise;

    const fileName = `converted-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(fileName);

    res.json({ path: publicUrlData.publicUrl });

  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/resize-image
// @desc    Resize images
// @access  Public
router.post('/resize-image', upload.array('images'), async (req, res) => {
  try {
    const { width, height } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const imageBuffer = file.buffer;

      const resizedBuffer = await sharp(imageBuffer)
        .resize(parseInt(width), parseInt(height))
        .toBuffer();

      const fileName = `resized-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, resizedBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      convertedFiles.push({
        originalname: fileName,
        path: publicUrlData.publicUrl
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/compress-image
// @desc    Compress images
// @access  Public
router.post('/compress-image', upload.array('images'), async (req, res) => {
  try {
    const { quality } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const imageBuffer = file.buffer;

      const compressedBuffer = await sharp(imageBuffer)
        .jpeg({ quality: parseInt(quality) })
        .toBuffer();

      const fileName = `compressed-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, compressedBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      convertedFiles.push({
        originalname: fileName,
        path: publicUrlData.publicUrl
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/convert-image-format
// @desc    Convert image format
// @access  Public
router.post('/convert-image-format', upload.array('images'), async (req, res) => {
  try {
    const { format } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const imageBuffer = file.buffer;

      const convertedBuffer = await sharp(imageBuffer)
        .toFormat(format)
        .toBuffer();

      const fileName = `converted-${Date.now()}.${format}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, convertedBuffer, {
          contentType: `image/${format}`,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      convertedFiles.push({
        originalname: fileName,
        path: publicUrlData.publicUrl
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/base64-image
// @desc    Encode/Decode image to/from Base64
// @access  Public
router.post('/base64-image', upload.single('image'), async (req, res) => {
  try {
    const { type, base64String } = req.body;

    if (type === 'encode' && req.file) {
      const imageBuffer = req.file.buffer;
      const base64 = imageBuffer.toString('base64');
      res.json({ base64 });
    } else if (type === 'decode' && base64String) {
      const buffer = Buffer.from(base64String, 'base64');
      const fileName = `decoded-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, buffer, {
          contentType: 'image/png',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      res.json({ path: publicUrlData.publicUrl });
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});
