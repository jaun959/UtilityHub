const PDFDocument = require('pdfkit');
const router = require('express').Router();
const multer = require('multer');
const archiver = require('archiver');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const os = require('os');
const fsp = require('fs').promises;

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/convert/png-to-jpg
// @desc    Convert PNG images to JPG
// @access  Public
router.post('/png-to-jpg', upload.array('images'), async (req, res) => {
  try {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      for (const file of req.files) {
        const imageBuffer = file.buffer;
        const originalname = file.originalname;
        const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');

        const jpgBuffer = await sharp(imageBuffer).jpeg().toBuffer();

        archive.append(jpgBuffer, { name: `${nameWithoutExt}_converted.jpg` });
      }
      archive.finalize();
    });

    const zipFileName = `converted_png_to_jpg_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

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

// @route   POST /api/convert/image-to-pdf
// @desc    Convert images to PDF
// @access  Public
router.post('/image-to-pdf', upload.array('images'), async (req, res) => {
  try {
    const pdfDoc = new PDFDocument({
      autoFirstPage: false
    });

    const tempPdfPath = path.join(os.tmpdir(), `converted_pdf_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(tempPdfPath);
    pdfDoc.pipe(writeStream);

    const pdfGenerationPromise = new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      pdfDoc.on('error', (err) => {
        console.error('PDFKit error during generation:', err);
        reject(err);
      });
    });

    for (const file of req.files) {
      let tempImagePath = '';
      try {
        const imageBuffer = file.buffer;

        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const pngBuffer = await image.png().toBuffer();

        tempImagePath = path.join(os.tmpdir(), `temp_image_${Date.now()}.png`);
        await fsp.writeFile(tempImagePath, pngBuffer);

        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        const imgWidth = metadata.width;
        const imgHeight = metadata.height;

        const scaleX = A4_WIDTH / imgWidth;
        const scaleY = A4_HEIGHT / imgHeight;
        const scale = Math.min(scaleX, scaleY);

        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;

        const x = (A4_WIDTH - finalWidth) / 2;
        const y = (A4_HEIGHT - finalHeight) / 2;

        pdfDoc.addPage({ size: 'A4' });
        pdfDoc.image(tempImagePath, x, y, { width: finalWidth, height: finalHeight });
      } catch (imageErr) {
        console.error(`Error processing image ${file.originalname}:`, imageErr);
      } finally {
        if (tempImagePath) {
          try {
            await fsp.unlink(tempImagePath);
          } catch (unlinkErr) {
            console.error(`Error deleting temp image file ${tempImagePath}:`, unlinkErr);
          }
        }
      }
    }

    pdfDoc.end();
    await pdfGenerationPromise;

    res.json({ path: tempPdfPath, originalname: path.basename(tempPdfPath) });

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
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      for (const file of req.files) {
        const imageBuffer = file.buffer;
        const originalname = file.originalname;
        const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');

        const resizedBuffer = await sharp(imageBuffer)
          .resize(parseInt(width), parseInt(height))
          .jpeg()
          .toBuffer();

        archive.append(resizedBuffer, { name: `${nameWithoutExt}_resized.jpg` });
      }
      archive.finalize();
    });

    const zipFileName = `resized_images_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

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
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      for (const file of req.files) {
        const imageBuffer = file.buffer;
        const originalname = file.originalname;
        const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');

        const compressedBuffer = await sharp(imageBuffer)
          .jpeg({ quality: parseInt(quality) })
          .toBuffer();

        archive.append(compressedBuffer, { name: `${nameWithoutExt}_compressed.jpg` });
      }
      archive.finalize();
    });

    const zipFileName = `compressed_images_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

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
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      for (const file of req.files) {
        const imageBuffer = file.buffer;
        const originalname = file.originalname;
        const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');

        const convertedBuffer = await sharp(imageBuffer)
          .toFormat(format)
          .toBuffer();

        archive.append(convertedBuffer, { name: `${nameWithoutExt}_converted.${format}` });
      }
      archive.finalize();
    });

    const zipFileName = `converted_images_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

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
      const outputFileName = `decoded-${Date.now()}.png`;

      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      const archiveBuffer = await new Promise(async (resolve, reject) => {
        const buffers = [];
        archive.on('data', (data) => buffers.push(data));
        archive.on('end', () => resolve(Buffer.concat(buffers)));
        archive.on('error', (err) => reject(err));

        archive.append(buffer, { name: outputFileName });
        archive.finalize();
      });

      const zipFileName = `decoded_image_${Date.now()}.zip`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(zipFileName, archiveBuffer, {
          contentType: 'application/zip',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(zipFileName);

      res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (err) {
    console.error(err);
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/image-flip
// @desc    Flip an image horizontally or vertically
// @access  Public
router.post('/image-flip', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded.' });
    }

    const imageBuffer = req.file.buffer;
    const originalname = req.file.originalname;
    const { direction } = req.body;

    let flippedBuffer;
    if (direction === 'horizontal') {
      flippedBuffer = await sharp(imageBuffer).flop().jpeg().toBuffer();
    } else if (direction === 'vertical') {
      flippedBuffer = await sharp(imageBuffer).flip().jpeg().toBuffer();
    } else {
      return res.status(400).json({ msg: "Invalid flip direction. Must be 'horizontal' or 'vertical'." });
    }

    const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');
    const outputFileName = `flipped-${nameWithoutExt}.jpg`;

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(flippedBuffer, { name: outputFileName });
      archive.finalize();
    });

    const zipFileName = `flipped_image_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/image-to-base64
// @desc    Convert image to Base64 string
// @access  Public
router.post('/image-to-base64', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded.' });
    }

    const imageBuffer = req.file.buffer;
    const base64 = imageBuffer.toString('base64');
    res.json({ base64 });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// @route   POST /api/convert/image-grayscale
// @desc    Convert image to grayscale
// @access  Public
router.post('/image-grayscale', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file uploaded.' });
    }

    const imageBuffer = req.file.buffer;
    const originalname = req.file.originalname;

    const grayscaleBuffer = await sharp(imageBuffer).grayscale().jpeg().toBuffer();

    const nameWithoutExt = originalname.split('.').slice(0, -1).join('.');
    const outputFileName = `grayscale-${nameWithoutExt}.jpg`;

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(grayscaleBuffer, { name: outputFileName });
      archive.finalize();
    });

    const zipFileName = `grayscale_image_${Date.now()}.zip`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(zipFileName, archiveBuffer, {
        contentType: 'application/zip',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(zipFileName);

    res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;