const router = require('express').Router();
const puppeteer = require('puppeteer');
const puppeteerCore = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const archiver = require('archiver');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const extractInternalLinks = (html, baseUrl) => {
  const $ = cheerio.load(html);
  const links = new Set();
  const urlObj = new URL(baseUrl);
  const domain = urlObj.hostname;

  $('a[href]').each((i, el) => {
    let href = $(el).attr('href');
    try {
      const absoluteUrl = new URL(href, baseUrl).href;
      const absoluteUrlObj = new URL(absoluteUrl);

      if (absoluteUrlObj.hostname === domain) {
        links.add(absoluteUrl);
      }
    } catch (e) { }
  });
  return Array.from(links);
};

// @route   POST /api/screenshot
// @desc    Generate screenshots of a given URL and its internal links (up to 5) and upload to Supabase as a ZIP
// @access  Public
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ msg: 'URL is required' });
  }

  let browser;
  const screenshots = [];
  const visitedUrls = new Set();
  const urlsToVisit = [url];
  const MAX_PAGES = 5;

  try {
    // Determine which Puppeteer to use based on environment
    // Use @sparticuz/chromium in production (e.g., Vercel, Netlify) or if explicitly set
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

    if (isProduction) {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
    } else {
      // Local development: Use standard puppeteer
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      });
    }

    while (urlsToVisit.length > 0 && visitedUrls.size < MAX_PAGES) {
      const currentUrl = urlsToVisit.shift();

      if (visitedUrls.has(currentUrl)) {
        continue;
      }

      const page = await browser.newPage();
      try {
        await page.goto(currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        visitedUrls.add(currentUrl);

        const screenshotBuffer = await page.screenshot({ fullPage: true });
        const pageTitle = await page.title();
        const screenshotFileName = `${pageTitle.replace(/[^a-z0-9]/gi, '_') || 'page'}-${visitedUrls.size}.png`;
        screenshots.push({ buffer: screenshotBuffer, name: screenshotFileName });

        const htmlContent = await page.content();
        const internalLinks = extractInternalLinks(htmlContent, currentUrl);

        for (const link of internalLinks) {
          if (!visitedUrls.has(link) && urlsToVisit.length + visitedUrls.size < MAX_PAGES) {
            urlsToVisit.push(link);
          }
        }

      } catch (pageError) {
        console.warn(`Could not navigate to or screenshot ${currentUrl}:`, pageError.message);
      } finally {
        await page.close();
      }
    }

    if (screenshots.length === 0) {
      return res.status(400).json({ msg: 'No screenshots could be generated for the provided URL or its internal links.' });
    }

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    const zipBuffer = await new Promise((resolve, reject) => {
      const buffers = [];
      archive.on('data', (data) => buffers.push(data));
      archive.on('end', () => resolve(Buffer.concat(buffers)));
      archive.on('error', (err) => reject(err));

      screenshots.forEach(ss => {
        archive.append(ss.buffer, { name: ss.name });
      });
      archive.finalize();
    });
    
    const zipFileName = `screenshots-${Date.now()}.zip`;
    const { data, error } = await supabase.storage
      .from('utilityhub')
      .upload(`screenshots/${zipFileName}`, zipBuffer, {
        contentType: 'application/zip',
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ msg: 'Failed to upload screenshot ZIP to Supabase', error: error.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from('utilityhub')
      .getPublicUrl(`screenshots/${zipFileName}`);

    res.status(200).json({ path: publicUrlData.publicUrl, originalname: zipFileName });

  } catch (err) {
    console.error('Error generating screenshots:', err);
    res.status(500).json({ msg: 'Failed to generate screenshots. Please check the URL.', error: err.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
