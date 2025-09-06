const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const poppler = require('pdf-poppler');
const { PDFDocument, degrees } = require('pdf-lib');
const archiver = require('archiver');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/convert/pdf-to-image
// @desc    Convert PDF to images
// @access  Public
router.post('/pdf-to-image', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    const pdfBuffer = file.buffer;

    const tempPdfPath = path.join(os.tmpdir(), `temp-${Date.now()}.pdf`);
    fs.writeFileSync(tempPdfPath, pdfBuffer);

    const opts = {
      format: 'jpeg',
      out_dir: os.tmpdir(),
      out_prefix: `converted-${Date.now()}`,
      page: null
    }

    await poppler.convert(tempPdfPath, opts);

    const files = fs.readdirSync(opts.out_dir).filter(f => f.startsWith(opts.out_prefix) && f.endsWith('.jpg'));
    console.log(`Found ${files.length} image files for zipping.`);

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => {
        const resultBuffer = Buffer.concat(buffers);
        console.log(`Archive buffer size: ${resultBuffer.length} bytes`);
        resolve(resultBuffer);
      });
      archive.on('error', (err) => reject(err));

      for (const f of files) {
        const imagePath = path.join(opts.out_dir, f);
        const imageBuffer = fs.readFileSync(imagePath);
        archive.append(imageBuffer, { name: f });
        fs.unlinkSync(imagePath);
      }
      archive.finalize();
    });

    fs.unlinkSync(tempPdfPath);

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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/merge-pdfs
// @desc    Merge multiple PDFs into one
// @access  Public
router.post('/merge-pdfs', upload.array('pdfs'), async (req, res) => {
  try {
    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();
    for (const file of req.files) {
      await merger.add(file.buffer);
    }

    const mergedPdfBuffer = await merger.saveAsBuffer();

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(mergedPdfBuffer, { name: `merged-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `merged_pdf_${Date.now()}.zip`;
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
    console.error('Error in merge-pdfs route:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/split-pdf
// @desc    Split a PDF into multiple pages
// @access  Public
router.post('/split-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const { ranges } = req.body;
    const file = req.file;

    if (!file) {
      console.error('Error splitting PDF: No PDF file uploaded.');
      return res.status(400).json({ message: 'No PDF file uploaded.' });
    }

    if (!ranges) {
      console.error('Error splitting PDF: No page ranges provided.');
      return res.status(400).json({ message: 'No page ranges provided.' });
    }

    const existingPdfBytes = file.buffer;
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

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(newPdfBytes), { name: `split-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `split_pdf_${Date.now()}.zip`;
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
    console.error('Error in split-pdf route:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/pdf-to-text
// @desc    Convert PDF to text
// @access  Public
router.post('/pdf-to-text', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    const pdfBuffer = file.buffer;
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;

    res.send(extractedText);

  } catch (err) {
    console.error('Error during PDF to text conversion:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/pdf-rotate
// @desc    Rotate pages in a PDF
// @access  Public
router.post('/pdf-rotate', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
    const { angle } = req.body;

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }
    if (!angle || ![90, 180, 270].includes(Number(angle))) {
      return res.status(400).json({ msg: 'Invalid rotation angle. Must be 90, 180, or 270.' });
    }

    const pdfBuffer = file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    for (const page of pdfDoc.getPages()) {
      page.setRotation(degrees(Number(angle)));
    }

    const modifiedPdfBytes = await pdfDoc.save();

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const archiveBuffer = await new Promise(async (resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(modifiedPdfBytes), { name: `rotated-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `rotated_pdf_${Date.now()}.zip`;
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
    console.error('Error during PDF rotation:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;