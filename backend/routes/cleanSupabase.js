const router = require('express').Router();
const { cleanSupabaseStorage } = require('../utils/supabaseCleaner');

// @route   POST /api/clean-supabase
// @desc    Trigger Supabase storage cleanup
// @access  Private (intended for scheduled jobs)
router.post('/', async (req, res) => {
  try {
    await cleanSupabaseStorage();
    res.status(200).json({ msg: 'Supabase cleanup triggered successfully.' });
  } catch (error) {
    console.error('Error triggering Supabase cleanup:', error);
    res.status(500).json({ msg: 'Failed to trigger Supabase cleanup.', error: error.message });
  }
});

module.exports = router;
