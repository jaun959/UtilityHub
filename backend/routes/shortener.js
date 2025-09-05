
const router = require('express').Router();
const shortid = require('shortid');
const Url = require('../models/Url');

router.post('/', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!originalUrl.startsWith('http')) {
    return res.status(400).json('Invalid URL');
  }

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      res.json(url);
    } else {
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/${urlCode}`;

      url = new Url({
        originalUrl,
        shortUrl,
        urlCode,
        date: new Date()
      });

      await url.save();
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /:code
// @desc    Redirect to long/original URL
// @access  Public
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No url found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;