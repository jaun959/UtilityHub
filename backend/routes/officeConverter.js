const router = require('express').Router();
const pdf = require('pdf-parse');
const {
  Document, Packer, Paragraph, TextRun,
} = require('docx');
const XLSX = require('xlsx');
const libre = require('libreoffice-convert');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// @route   POST /api/convert/pdf-to-word
// @desc    Convert PDF to Word (Text Extraction)
// @access  Public
router.post('/pdf-to-word', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    console.log('PDF to Word (text extraction) conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    const pdfBuffer = file.buffer;

    const data = await pdf(pdfBuffer);
    let extractedText = data.text;

    extractedText = extractedText.replace(/\./g, '.\n');
    extractedText = extractedText.replace(/\n\s*\n/g, '\n');
    extractedText = extractedText.replace(/\. \n/g, '.\n');

    const doc = new Document({
      sections: [{
        properties: {},
        children: extractedText.split('\n').map((line) => new Paragraph({
          children: [new TextRun(line)],
        })),
      }],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    const fileName = `converted-${Date.now()}.docx`;
    const { error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, docxBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(fileName);

    return res.json({ path: publicUrlData.publicUrl, originalname: fileName });
  } catch (err) {
    console.error('Error during PDF to Word (text extraction) conversion:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/word-to-pdf
// @desc    Convert Word to PDF
// @access  Public
router.post('/word-to-pdf', (req, res, next) => req.upload.single('doc')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    console.log('Word to PDF conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No Word file uploaded.' });
    }

    const docxBuf = file.buffer;

    const pdfBuf = await libre.convertAsync(docxBuf, '.pdf', undefined);

    const fileName = `converted-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, pdfBuf, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(fileName);

    return res.json({ path: publicUrlData.publicUrl, originalname: fileName });
  } catch (err) {
    console.error('Error during Word to PDF conversion:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/excel-to-pdf
// @desc    Convert Excel to PDF
// @access  Public
router.post('/excel-to-pdf', (req, res, next) => req.upload.single('excel')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ msg: 'No Excel file uploaded.' });
    }
    console.log('Excel to PDF conversion requested for:', file.originalname);

    const excelBuffer = file.buffer;

    const pdfBuffer = await libre.convertAsync(excelBuffer, '.pdf', undefined);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="converted-${Date.now()}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Error during Excel to PDF conversion:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/convert/pdf-to-excel
// @desc    Convert PDF to Excel (Text Extraction)
// @access  Public
router.post('/pdf-to-excel', (req, res, next) => req.upload.single('pdf')(req, res, next), async (req, res) => {
  try {
    const { file } = req;
    console.log('PDF to Excel (text extraction) conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No PDF file uploaded.' });
    }

    const pdfBuffer = file.buffer;

    const data = await pdf(pdfBuffer);
    const extractedText = data.text;

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[extractedText]]);

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const fileName = `converted-${Date.now()}.xlsx`;
    const { error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, excelBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(fileName);

    return res.json({ path: publicUrlData.publicUrl, originalname: fileName });
  } catch (err) {
    console.error('Error during PDF to Excel (text extraction) conversion:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});



module.exports = router;
