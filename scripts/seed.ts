import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase env variables. Please check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// We need to import the data. Since we are running outside Next, we'll just redefine it here
// or use ts-node to import it. To keep it simple, we define it here or rely on tsx.
import { menuData, offersData } from '../src/data/menu';

async function seed() {
  console.log('Seeding Database...');

  // 1. Insert Offers
  console.log('Inserting Offers...');
  for (const offer of offersData) {
    const { error } = await supabase.from('offers').insert({
      name: offer.name,
      description: offer.description,
      special_text: offer.specialText,
      image_url: offer.imageUrl || null,
      size: offer.prices[0].size,
      price: offer.prices[0].price,
      is_active: true
    });
    if (error) console.error("Error inserting offer:", error.message);
  }

  // 2. Insert Categories and Items
  console.log('Inserting Categories and Items...');
  let sortOrder = 0;
  for (const category of menuData) {
    const { data: catData, error: catError } = await supabase
      .from('menu_categories')
      .insert({ title: category.title, sort_order: sortOrder++ })
      .select('id')
      .single();

    if (catError) {
      console.error("Error inserting category:", catError.message);
      continue;
    }

    let itemSortOrder = 0;
    for (const item of category.items) {
      const { data: itemData, error: itemError } = await supabase
        .from('menu_items')
        .insert({
          category_id: catData.id,
          name: item.name,
          description: item.description || null,
          image_url: item.imageUrl || null,
          sort_order: itemSortOrder++
        })
        .select('id')
        .single();

      if (itemError) {
        console.error("Error inserting item:", itemError.message);
        continue;
      }

      // Insert Prices
      for (const price of item.prices) {
        const { error: priceError } = await supabase
          .from('menu_prices')
          .insert({
            item_id: itemData.id,
            size: price.size,
            price: price.price
          });

        if (priceError) {
          console.error("Error inserting price:", priceError.message);
        }
      }
    }
  }

  console.log('Seeding Completed!');
}

seed().catch(console.error);
