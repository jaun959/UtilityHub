const router = require('express').Router();
const { PDFDocument, degrees } = require('pdf-lib');
const archiver = require('archiver');
const { createClient } = require('@supabase/supabase-js');
const pdfParse = require('pdf-parse');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// @route   POST /api/convert/merge-pdfs
// @desc    Merge multiple PDFs into one
// @access  Public
router.post('/merge-pdfs', (req, res, next) => req.upload.array('pdfs')(req, res, next), async (req, res) => {
  try {
    const { files } = req;
    if (!files || files.length === 0) {
      return res.status(400).json({ msg: 'No files uploaded.' });
    }

    const PDFMerger = (await import('pdf-merger-js')).default;
    const merger = new PDFMerger();
    await Promise.all(files.map((file) => merger.add(file.buffer)));

    const mergedPdfBuffer = await merger.saveAsBuffer();

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(mergedPdfBuffer, { name: `merged-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `merged_pdf_${Date.now()}.zip`;
    const { error: uploadError } = await supabase.storage
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

    return res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
  } catch (err) {
    console.error('Error in merge-pdfs route:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/split-pdf
// @desc    Split a PDF into multiple pages
// @access  Public
router.post('/split-pdf', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { ranges } = req.body;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    if (!ranges) {
      return res.status(400).json({ msg: 'No page ranges provided.' });
    }

    const existingPdfBytes = file.buffer;
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();

    const newPdfDoc = await PDFDocument.create();

    const pageRanges = ranges.split(',').map((r) => r.trim());
    const pageNumbers = [];
    pageRanges.forEach((range) => {
      if (range.includes('-')) {
        const [start, end] = range.split('-').map((n) => parseInt(n, 10));
        if (Number.isNaN(start) || Number.isNaN(end)
        || start < 1 || end > totalPages || start > end) {
          throw new Error(`Invalid page range: ${range}`);
        }
        for (let i = start; i <= end; i += 1) {
          pageNumbers.push(i - 1);
        }
      } else {
        const pageNum = parseInt(range, 10);
        if (Number.isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
          throw new Error(`Invalid page number: ${pageNum}`);
        }
        pageNumbers.push(pageNum - 1);
      }
    });
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageNumbers);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));

    const newPdfBytes = await newPdfDoc.save();

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(newPdfBytes), { name: `split-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `split_pdf_${Date.now()}.zip`;
    const { error: uploadError } = await supabase.storage
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

    return res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
  } catch (err) {
    console.error('Error in split-pdf route:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/pdf-to-text
// @desc    Convert PDF to text
// @access  Public
router.post('/pdf-to-text', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    const pdfBuffer = file.buffer;
    const data = await pdfParse(pdfBuffer);
    const extractedText = data.text;

    return res.send(extractedText);
  } catch (err) {
    console.error('Error during PDF to text conversion:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/pdf-rotate
// @desc    Rotate pages in a PDF
// @access  Public
router.post('/pdf-rotate', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    const { angle } = req.body;

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }
    if (!angle || ![90, 180, 270].includes(Number(angle))) {
      return res.status(400).json({ msg: 'Invalid rotation angle. Must be 90, 180, or 270.' });
    }

    const pdfBuffer = file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    pdfDoc.getPages().forEach((page) => {
      page.setRotation(degrees(Number(angle)));
    });

    const modifiedPdfBytes = await pdfDoc.save();

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(modifiedPdfBytes), { name: `rotated-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `rotated_pdf_${Date.now()}.zip`;
    const { error: uploadError } = await supabase.storage
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

    return res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
  } catch (err) {
    console.error('Error during PDF rotation:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/compress-pdf
// @desc    Compress a PDF file
// @access  Public
router.post('/compress-pdf', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    const pdfBuffer = file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const compressedPdfBytes = await pdfDoc.save();

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(compressedPdfBytes), { name: `compressed-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `compressed_pdf_${Date.now()}.zip`;
    const { error: uploadError } = await supabase.storage
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

    return res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
  } catch (err) {
    console.error('Error during PDF compression:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/pdf-password
// @desc    Protect or unprotect a PDF with a password
// @access  Public
router.post('/pdf-password', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    const { password, action } = req.body;

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }
    if (!action || (action === 'protect' && !password)) {
      return res.status(400).json({ msg: 'Missing password or invalid action.' });
    }

    const pdfBuffer = file.buffer;
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    let modifiedPdfBytes;

    if (action === 'protect') {
      modifiedPdfBytes = await pdfDoc.save({
        userPassword: password,
        ownerPassword: password,
        permissions: {},
      });
    } else if (action === 'remove') {
      modifiedPdfBytes = await pdfDoc.save();
    } else {
      return res.status(400).json({ msg: 'Invalid action. Must be \'protect\' or \'remove\'.' });
    }

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    const archiveBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      archive.append(Buffer.from(modifiedPdfBytes), { name: `${action}ed-${Date.now()}.pdf` });
      archive.finalize();
    });

    const zipFileName = `${action}ed_pdf_${Date.now()}.zip`;
    const { error: uploadError } = await supabase.storage
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

    return res.json({ path: publicUrlData.publicUrl, originalname: zipFileName });
  } catch (err) {
    console.error('Error during PDF password operation:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
