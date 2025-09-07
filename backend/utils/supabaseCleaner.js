const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const SUPABASE_BUCKET_NAME = 'utilityhub';
const DAYS_TO_KEEP = 7;

const cleanSupabaseStorage = async () => {
  console.log('Starting Supabase storage cleanup...');
  const now = new Date();
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - DAYS_TO_KEEP));

  try {
    const { data: files, error: listError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'asc' },
      });

    if (listError) {
      throw listError;
    }

    if (!files || files.length === 0) {
      console.log('No files found in Supabase bucket.');
      return;
    }

    const filesToDelete = files.filter((file) => {
      const fileCreatedAt = new Date(file.created.at);
      return fileCreatedAt < sevenDaysAgo;
    }).map((file) => file.name);

    if (filesToDelete.length > 0) {
      console.log(`Found ${filesToDelete.length} files older than ${DAYS_TO_KEEP} days to delete.`);
      const { error: deleteError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .remove(filesToDelete);

      if (deleteError) {
        throw deleteError;
      }
      console.log(`Successfully deleted ${filesToDelete.length} old files from Supabase.`);
    } else {
      console.log('No old files found to delete from Supabase.');
    }
  } catch (error) {
    console.error('Error during Supabase storage cleanup:', error.message);
  }
};

module.exports = { cleanSupabaseStorage };
