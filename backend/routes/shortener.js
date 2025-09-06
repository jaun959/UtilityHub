
const router = require('express').Router();
const shortid = require('shortid');
const Url = require('../models/Url');

router.post('/', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  const urlRegex = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})$/;

  if (!urlRegex.test(originalUrl)) {
    return res.status(400).json({ msg: 'Please enter a valid URL.' });
  }

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      res.json(url);
    } else {
      let urlCode;
      let shortUrl;
      let isUnique = false;

      while (!isUnique) {
        urlCode = shortid.generate();
        shortUrl = `${baseUrl}/shorten/${urlCode}`;
        const existingUrl = await Url.findOne({ urlCode });
        if (!existingUrl) {
          isUnique = true;
        }
      }

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
    res.status(500).json({ msg: 'Server error during URL shortening.' });
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
    res.status(500).json({ msg: 'Server error during URL redirection.' });
  }
});

module.exports = router;