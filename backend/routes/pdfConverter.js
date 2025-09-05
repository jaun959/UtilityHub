const router = require('express').Router();
const axios = require('axios');
const multer = require('multer');

const path = require('path');
const fs = require('fs');
const { poppler } = require('pdf-poppler');
const { PDFDocument } = require('pdf-lib');

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/convert/pdf-to-image
// @desc    Convert PDF to images
// @access  Public
router.post('/pdf-to-image', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;

    const response = await axios.get(file.path, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);

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

      const fileName = `converted-${Date.now()}-${f}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('utilityhub')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('utilityhub')
        .getPublicUrl(fileName);

      convertedFiles.push({
        originalname: f,
        path: publicUrlData.publicUrl
      });
      fs.unlinkSync(imagePath);
    }

    fs.unlinkSync(tempPdfPath);

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
router.post('/merge-pdfs', upload.array('pdfs'), async (req, res) => {
  try {
    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();
    for (const file of req.files) {
      const response = await axios.get(file.path, { responseType: 'arraybuffer' });
      const pdfBuffer = Buffer.from(response.data);
      await merger.add(pdfBuffer);
    }

    const mergedPdfBuffer = await merger.saveAsBuffer();

    const fileName = `merged-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, mergedPdfBuffer, {
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/split-pdf
// @desc    Split a PDF into multiple pages
// @access  Public
router.post('/split-pdf', upload.single('pdf'), async (req, res) => {
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

    const fileName = `split-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, newPdfBytes, {
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});