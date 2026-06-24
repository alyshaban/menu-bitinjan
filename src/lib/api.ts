import { supabase } from './supabase';
import { MenuItem, MenuCategory } from '@/data/menu';
import { unstable_cache } from 'next/cache';

export const getSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error || !data) return {};
    return data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
  },
  ['settings-cache'],
  { tags: ['settings'], revalidate: 3600 }
);

export const getOffers = unstable_cache(
  async (): Promise<MenuItem[]> => {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .eq('is_active', true);

    if (error || !data) {
      console.error("Error fetching offers:", error?.message);
      return [];
    }

    return data.map(offer => ({
      id: offer.id,
      name: offer.name,
      description: offer.description,
      isSpecial: true,
      specialText: offer.special_text,
      imageUrl: offer.image_url,
      prices: [
        { size: offer.size, price: Number(offer.price) }
      ]
    }));
  },
  ['offers-cache'], // Cache key
  {
    tags: ['offers'], // Tag used for on-demand revalidation
    revalidate: 3600, // Background revalidation every hour just in case
  }
);

export const getMenuData = unstable_cache(
  async (): Promise<MenuCategory[]> => {
    const { data: categories, error: catError } = await supabase
      .from('menu_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catError || !categories) {
      console.error("Error fetching categories:", catError?.message);
      return [];
    }

    const { data: items, error: itemsError } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_prices (*)
      `)
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (itemsError || !items) {
      console.error("Error fetching items:", itemsError?.message);
      return [];
    }

    return categories.map(cat => {
      const catItems = items.filter(item => item.category_id === cat.id);
      return {
        id: cat.id,
        title: cat.title,
        items: catItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.image_url,
          prices: (item.menu_prices || []).map((p: { size: string; price: number | string }) => ({
            size: p.size,
            price: Number(p.price)
          }))
        }))
      };
    });
  },
  ['menu-data-cache'], // Cache key
  {
    tags: ['menu'], // Tag used for on-demand revalidation
    revalidate: 3600, // Background revalidation every hour just in case
  }
);

