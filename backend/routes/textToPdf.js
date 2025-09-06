const router = require('express').Router();
const PDFDocument = require('pdfkit');

// @route   POST /api/convert/text-to-pdf
// @desc    Convert text to PDF and send for direct download
// @access  Public
router.post('/text-to-pdf', async (req, res) => {
  const { text } = req.body;

  try {
    const doc = new PDFDocument();
    const pdfBufferPromise = new Promise((resolve, reject) => {
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => { resolve(Buffer.concat(buffers)); });
      doc.on('error', reject);
    });

    doc.text(text);
    doc.end();

    const pdfBuffer = await pdfBufferPromise;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="converted-text-${Date.now()}.pdf"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;