
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const PDFDocument = require('pdfkit');
const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'utilityhub',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

// @route   POST /api/convert/png-to-jpg
// @desc    Convert PNG images to JPG
// @access  Public
router.post('/png-to-jpg', auth, authorize(['premium']), upload.array('images'), async (req, res) => {
  try {
    const convertedFiles = [];
    for (const file of req.files) {
      // Download image from Cloudinary
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      // Process with sharp
      const jpgBuffer = await sharp(imageBuffer).jpeg().toBuffer();

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${jpgBuffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });

      convertedFiles.push({
        originalname: uploadResult.original_filename + '.jpg',
        path: uploadResult.secure_url
      });
    }
    res.json(convertedFiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @route   POST /api/convert/image-to-pdf
// @desc    Convert images to PDF
// @access  Public
router.post('/image-to-pdf', auth, authorize(['premium']), upload.array('images'), async (req, res) => {
  try {
    const pdfDoc = new PDFDocument();
    const pdfBufferPromise = new Promise((resolve, reject) => {
      pdfDoc.on('data', resolve);
      pdfDoc.on('end', () => resolve(pdfDoc.output));
      pdfDoc.on('error', reject);
    });

    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      pdfDoc.addPage({ size: [metadata.width, metadata.height] });
      pdfDoc.image(imageBuffer, 0, 0, { width: metadata.width, height: metadata.height });
    }

    pdfDoc.end();

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

// @route   POST /api/convert/resize-image
// @desc    Resize images
// @access  Public
router.post('/resize-image', auth, authorize(['premium']), upload.array('images'), async (req, res) => {
  try {
    const { width, height } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const resizedBuffer = await sharp(imageBuffer)
        .resize(parseInt(width), parseInt(height))
        .toBuffer();

      const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${resizedBuffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });

      convertedFiles.push({
        originalname: uploadResult.original_filename + '.jpg',
        path: uploadResult.secure_url
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/compress-image
// @desc    Compress images
// @access  Public
router.post('/compress-image', auth, authorize(['premium']), upload.array('images'), async (req, res) => {
  try {
    const { quality } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const compressedBuffer = await sharp(imageBuffer)
        .jpeg({ quality: parseInt(quality) })
        .toBuffer();

      const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${compressedBuffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });

      convertedFiles.push({
        originalname: uploadResult.original_filename + '.jpg',
        path: uploadResult.secure_url
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/convert-image-format
// @desc    Convert image format
// @access  Public
router.post('/convert-image-format', auth, authorize(['premium']), upload.array('images'), async (req, res) => {
  try {
    const { format } = req.body;
    const convertedFiles = [];

    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const convertedBuffer = await sharp(imageBuffer)
        .toFormat(format)
        .toBuffer();

      const uploadResult = await cloudinary.uploader.upload(`data:image/${format};base64,${convertedBuffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });

      convertedFiles.push({
        originalname: uploadResult.original_filename + '.' + format,
        path: uploadResult.secure_url
      });
    }

    res.json(convertedFiles);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/base64-image
// @desc    Encode/Decode image to/from Base64
// @access  Public
router.post('/base64-image', auth, upload.single('image'), async (req, res) => {
  try {
    const { type, base64String } = req.body;

    if (type === 'encode' && req.file) {
      const response = await axios.get(req.file.path, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);
      const base64 = imageBuffer.toString('base64');
      res.json({ base64 });
    } else if (type === 'decode' && base64String) {
      const buffer = Buffer.from(base64String, 'base64');
      const uploadResult = await cloudinary.uploader.upload(`data:image/png;base64,${buffer.toString('base64')}`, {
        folder: 'utilityhub',
        resource_type: 'image'
      });
      res.json({ path: uploadResult.secure_url });
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
