"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Helper: extract storage filename from a public URL
function extractStorageFileName(url: string | null): string | null {
  if (!url) return null;
  try {
    const parts = new URL(url).pathname.split("/");
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

async function deleteImageFromStorage(url: string | null) {
  const fileName = extractStorageFileName(url);
  if (!fileName) return;
  const { getAdminSupabase } = await import("@/lib/supabase");
  const adminSupabase = getAdminSupabase();
  await adminSupabase.storage.from("offers-images").remove([fileName]);
}

export async function uploadOfferImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return null;

  const { getAdminSupabase } = await import("@/lib/supabase");
  const supabase = getAdminSupabase();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("offers-images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data } = supabase.storage.from("offers-images").getPublicUrl(fileName);
  return data.publicUrl;
}

export async function addOffer(data: {
  name: string;
  description?: string;
  specialText?: string;
  imageUrl?: string;
  size: string;
  price: string | number;
  isActive: boolean;
}, formData: FormData | null) {
  const supabase = await createClient();
  let imageUrl = data.imageUrl || null;

  if (formData) {
    const uploadedUrl = await uploadOfferImageAction(formData);
    if (uploadedUrl) imageUrl = uploadedUrl;
  }

  const { error } = await supabase
    .from("offers")
    .insert({
      name: data.name,
      description: data.description || null,
      special_text: data.specialText || null,
      image_url: imageUrl,
      size: data.size,
      price: data.price,
      is_active: data.isActive
    });

  if (error) {
    console.error("Error adding offer:", error);
    return { error: "فشل في إضافة العرض" };
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("offers");
  revalidatePath("/admin/offers");
  revalidatePath("/");
  return { success: true };
}

export async function editOffer(id: string, data: {
  name: string;
  description?: string;
  specialText?: string;
  imageUrl?: string;
  size: string;
  price: string | number;
  isActive: boolean;
}, formData: FormData | null) {
  const supabase = await createClient();
  let imageUrl = data.imageUrl || null;

  // If a new image is uploaded, delete the old one first
  if (formData) {
    const uploadedUrl = await uploadOfferImageAction(formData);
    if (uploadedUrl) {
      // Delete old image from storage if it was different
      if (data.imageUrl && data.imageUrl !== uploadedUrl) {
        await deleteImageFromStorage(data.imageUrl);
      }
      imageUrl = uploadedUrl;
    }
  }

  const { error } = await supabase
    .from("offers")
    .update({
      name: data.name,
      description: data.description || null,
      special_text: data.specialText || null,
      image_url: imageUrl,
      size: data.size,
      price: data.price,
      is_active: data.isActive
    })
    .eq("id", id);

  if (error) {
    console.error("Error editing offer:", error);
    return { error: "فشل في تعديل العرض" };
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("offers");
  revalidatePath("/admin/offers");
  revalidatePath("/");
  return { success: true };
}

export async function deleteOffer(id: string) {
  const supabase = await createClient();

  // 1. Fetch image_url before deleting
  const { data: offer } = await supabase
    .from("offers")
    .select("image_url")
    .eq("id", id)
    .single();

  // 2. Delete from DB
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting offer:", error);
    return { error: "فشل في حذف العرض" };
  }

  // 3. Delete image from Storage
  await deleteImageFromStorage(offer?.image_url ?? null);

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("offers");
  revalidatePath("/admin/offers");
  revalidatePath("/");
  return { success: true };
}
