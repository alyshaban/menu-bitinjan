"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function addCategory(formData: FormData) {
  const title = formData.get("title") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_categories")
    .insert({ title, sort_order });

  if (error) {
    console.error("Error adding category:", error);
    return { error: "فشل في إضافة القسم" };
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  // 1. Fetch all image URLs of items in this category BEFORE cascade deletes them
  const { data: items } = await supabase
    .from("menu_items")
    .select("image_url")
    .eq("category_id", id);

  // 2. Delete the category → CASCADE removes items + prices automatically
  const { error } = await supabase
    .from("menu_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: "فشل في حذف القسم." };
  }

  // 3. Delete all item images from Storage (so no orphan files accumulate)
  const imageFileNames = (items ?? [])
    .map((item) => extractStorageFileName(item.image_url))
    .filter(Boolean) as string[];

  if (imageFileNames.length > 0) {
    const { getAdminSupabase } = await import("@/lib/supabase");
    const adminSupabase = getAdminSupabase();
    await adminSupabase.storage.from("menu-images").remove(imageFileNames);
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function editCategory(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_categories")
    .update({ title, sort_order })
    .eq("id", id);

  if (error) {
    console.error("Error editing category:", error);
    return { error: "فشل في تعديل القسم" };
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function addMenuItem(data: {
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  prices: { size: string; price: string | number }[];
}) {
  const supabase = await createClient();


  // 1. Insert Item
  const { data: insertedItem, error: itemError } = await supabase
    .from("menu_items")
    .insert({
      category_id: data.categoryId,
      name: data.name,
      description: data.description,
      image_url: data.imageUrl || null,
      is_visible: true,
      sort_order: 0
    })
    .select()
    .single();

  if (itemError) {
    console.error("Error adding item:", itemError);
    return { error: "فشل في إضافة الصنف" };
  }

  // 2. Insert Prices
  if (data.prices && data.prices.length > 0) {
    const pricesToInsert = data.prices.map((p) => ({
      item_id: insertedItem.id,
      size: p.size,
      price: p.price
    }));

    const { error: priceError } = await supabase
      .from("menu_prices")
      .insert(pricesToInsert);

    if (priceError) {
      console.error("Error adding prices:", priceError);
      return { error: "تم إضافة الصنف لكن فشل إضافة الأسعار" };
    }
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return null;

  // Use service role client to bypass Storage RLS
  const { getAdminSupabase } = await import("@/lib/supabase");
  const supabase = getAdminSupabase();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function editMenuItem(id: string, data: {
  name: string;
  description: string;
  imageUrl?: string;
  prices: { size: string; price: string | number }[];
}) {
  const supabase = await createClient();

  // 1. Update Item
  const { error: itemError } = await supabase
    .from("menu_items")
    .update({
      name: data.name,
      description: data.description,
      image_url: data.imageUrl || null,
    })
    .eq("id", id);

  if (itemError) {
    console.error("Error editing item:", itemError);
    return { error: "فشل في تعديل الصنف" };
  }

  // 2. Update Prices (Delete old, insert new)
  await supabase.from("menu_prices").delete().eq("item_id", id);

  if (data.prices && data.prices.length > 0) {
    const pricesToInsert = data.prices.map((p) => ({
      item_id: id,
      size: p.size,
      price: p.price
    }));

    const { error: priceError } = await supabase
      .from("menu_prices")
      .insert(pricesToInsert);

    if (priceError) {
      console.error("Error adding new prices:", priceError);
      return { error: "تم التعديل لكن فشل تحديث الأسعار" };
    }
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}

// Helper: extract storage filename from a public URL
function extractStorageFileName(url: string | null): string | null {
  if (!url) return null;
  try {
    const parts = new URL(url).pathname.split("/");
    // URL format: .../storage/v1/object/public/menu-images/FILENAME
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();

  // 1. Fetch item to get image_url before deleting
  const { data: item } = await supabase
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  // 2. Delete from DB
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting item:", error);
    return { error: "فشل في حذف الصنف" };
  }

  // 3. Delete image from Storage (if exists)
  const fileName = extractStorageFileName(item?.image_url ?? null);
  if (fileName) {
    const { getAdminSupabase } = await import("@/lib/supabase");
    const adminSupabase = getAdminSupabase();
    await adminSupabase.storage.from("menu-images").remove([fileName]);
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("menu");
  revalidatePath("/admin/menu");
  revalidatePath("/");
  return { success: true };
}
