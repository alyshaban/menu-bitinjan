"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  
  // Extract all keys from formData
  const updates = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      updates.push({ key, value });
    }
  }

  if (updates.length === 0) return { success: true };

  // Upsert all settings
  const { error } = await supabase
    .from("settings")
    .upsert(updates, { onConflict: "key" });

  if (error) {
    console.error("Error updating settings:", error);
    return { error: "فشل في تحديث الإعدادات" };
  }

  // @ts-expect-error – revalidateTag is typed but works at runtime
  revalidateTag("settings");
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
