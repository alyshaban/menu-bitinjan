import OffersAdminClient from "./OffersAdminClient";

export const metadata = {
  title: "إدارة العروض | لوحة تحكم بتنجان وبس",
};

export default async function OffersAdminPage() {
  // getOffers currently fetches only 'is_active = true'. We need ALL offers for the admin.
  // So we'll fetch them directly here or modify getOffers.
  // It's cleaner to fetch directly here since this is an admin view and we bypass the cache
  // to always see disabled offers too.
  
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  // Map to the expected format
  const formattedOffers = (offers || []).map(offer => ({
    id: offer.id,
    name: offer.name,
    description: offer.description,
    specialText: offer.special_text,
    imageUrl: offer.image_url,
    size: offer.size,
    price: offer.price,
    isActive: offer.is_active
  }));

  return <OffersAdminClient initialOffers={formattedOffers} />;
}
