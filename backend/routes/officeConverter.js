const router = require('express').Router();
const multer = require('multer');
const pdf = require('pdf-parse');
const { Document, Packer, Paragraph, TextRun, ImageRun } = require('docx');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const XLSX = require('xlsx');
const libre = require('libreoffice-convert');
const util = require('util');
libre.convertAsync = util.promisify(libre.convert);

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/convert/pdf-to-word
// @desc    Convert PDF to Word (Text Extraction)
// @access  Public
router.post('/pdf-to-word', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
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
        children: extractedText.split('\n').map(line => new Paragraph({
          children: [new TextRun(line)],
        })),
      }],
    });

    const docxBuffer = await Packer.toBuffer(doc);

    const fileName = `converted-${Date.now()}.docx`;
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    res.json({ path: publicUrlData.publicUrl, originalname: fileName });

  } catch (err) {
    console.error('Error during PDF to Word (text extraction) conversion:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/word-to-pdf
// @desc    Convert Word to PDF
// @access  Public
router.post('/word-to-pdf', upload.single('doc'), async (req, res) => {
  try {
    const file = req.file;
    console.log('Word to PDF conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No Word file uploaded.' });
    }

    const docxBuf = file.buffer;

    let pdfBuf = await libre.convertAsync(docxBuf, '.pdf', undefined);

    const fileName = `converted-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    res.json({ path: publicUrlData.publicUrl, originalname: fileName });

  } catch (err) {
    console.error('Error during Word to PDF conversion:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/excel-to-pdf
// @desc    Convert Excel to PDF
// @access  Public
router.post('/excel-to-pdf', upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded or incorrect field name. Expected field name: excel' });
    }
    const file = req.file;
    console.log('Excel to PDF conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No Excel file uploaded.' });
    }

    const excelBuffer = file.buffer;
    const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    const fontSize = 10;
    const rowHeight = fontSize + 5;
    const cellPadding = 2;

    const columnWidths = jsonData[0].map((_, colIndex) => {
      let maxWidth = 0;
      jsonData.forEach(row => {
        const cellText = String(row[colIndex] || '').replace(/\n/g, ' ').replace(//g, '').replace(/[^\x00-\x7F]/g, '');
        const textWidth = font.widthOfTextAtSize(cellText, fontSize);
        if (textWidth > maxWidth) {
          maxWidth = textWidth;
        }
      });
      return maxWidth + cellPadding * 2;
    });

    const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    let x = margin;

    const filterNonAscii = (text) => {
      return text.replace(/[^\x00-\x7F]/g, '');
    };

    for (let i = 0; i < jsonData[0].length; i++) {
      const headerText = filterNonAscii(String(jsonData[0][i] || ''));
      page.drawText(headerText, {
        x: x + cellPadding,
        y: y - fontSize,
        font,
        fontSize,
        color: rgb(0, 0, 0),
      });
      x += columnWidths[i];
    }
    y -= rowHeight;

    page.drawLine({
      start: { x: margin, y: y },
      end: { x: margin + totalTableWidth, y: y },
      color: rgb(0, 0, 0),
      thickness: 1,
    });
    y -= 5;

    for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
      x = margin;
      for (let colIndex = 0; colIndex < jsonData[rowIndex].length; colIndex++) {
        const cellText = String(jsonData[rowIndex][colIndex] || '').replace(/\n/g, ' ').replace(/\u2022/g, '').replace(/[^\x00-\x7F]/g, '');
        page.drawText(cellText, {
          x: x + cellPadding,
          y: y - fontSize,
          font,
          fontSize,
          color: rgb(0, 0, 0),
        });
        x += columnWidths[colIndex];
      }
      y -= rowHeight;

      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="converted-${Date.now()}.pdf"`);
    res.send(pdfBytes);

  } catch (err) {
    console.error('Error during Excel to PDF conversion:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/pdf-to-excel
// @desc    Convert PDF to Excel (Text Extraction)
// @access  Public
router.post('/pdf-to-excel', upload.single('pdf'), async (req, res) => {
  try {
    const file = req.file;
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
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    res.json({ path: publicUrlData.publicUrl, originalname: fileName });

  } catch (err) {
    console.error('Error during PDF to Excel (text extraction) conversion:', err);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/convert/excel-to-word
// @desc    Convert Excel to Word
// @access  Public
router.post('/excel-to-word', async (req, res) => {
  try {
    const file = req.file;
    console.log('Excel to Word conversion requested for:', file.originalname);

    if (!file) {
      return res.status(400).json({ msg: 'No Excel file uploaded.' });
    }

    const excelBuf = file.buffer;

    let wordBuf = await libre.convertAsync(excelBuf, '.docx', undefined);

    const fileName = `converted-${Date.now()}.docx`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('utilityhub')
      .upload(fileName, wordBuf, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(fileName);

    res.json({ path: publicUrlData.publicUrl, originalname: fileName });

  } catch (err) {
    console.error('Error during Excel to Word conversion:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;