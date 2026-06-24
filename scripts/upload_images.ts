import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const BUCKET_NAME = 'menu-images';

async function uploadImages() {
  console.log(`Ensuring bucket "${BUCKET_NAME}" exists...`);

  // 1. Check if bucket exists, if not create it
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.find(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Make it public so anyone can see the images
      fileSizeLimit: 5242880, // 5MB
    });
    if (createError) {
      console.error("Error creating bucket:", createError);
      return;
    }
    console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }

  // 2. Upload files from public folder
  const publicDir = path.join(process.cwd(), 'public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  console.log(`Found ${files.length} images to upload...`);

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const fileBuffer = fs.readFileSync(filePath);

    // We use the file name as the path in the bucket
    console.log(`Uploading ${file}...`);
    const { data: _data, error } = await supabase.storage.from(BUCKET_NAME).upload(file, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg'
    });

    if (error) {
      console.error(`Error uploading ${file}:`, error.message);
    } else {
      console.log(`Successfully uploaded ${file}.`);
    }
  }

  // 3. Update database URLs
  console.log("Updating database image URLs...");
  const publicUrlBase = supabase.storage.from(BUCKET_NAME).getPublicUrl('').data.publicUrl;

  // Update items
  const { data: items } = await supabase.from('menu_items').select('id, image_url');
  if (items) {
    for (const item of items) {
      if (item.image_url && item.image_url.startsWith('/')) {
        const fileName = item.image_url.replace('/', '');
        const newUrl = `${publicUrlBase}${fileName}`;
        await supabase.from('menu_items').update({ image_url: newUrl }).eq('id', item.id);
      }
    }
  }

  // Update offers
  const { data: offers } = await supabase.from('offers').select('id, image_url');
  if (offers) {
    for (const offer of offers) {
      if (offer.image_url && offer.image_url.startsWith('/')) {
        const fileName = offer.image_url.replace('/', '');
        const newUrl = `${publicUrlBase}${fileName}`;
        await supabase.from('offers').update({ image_url: newUrl }).eq('id', offer.id);
      }
    }
  }

  console.log("Database updated successfully!");
}

uploadImages().catch(console.error);
