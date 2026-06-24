"use server";

import { getAdminSupabase } from "@/lib/supabase";

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const message = formData.get("message")?.toString() || "";

  if (!message.trim()) {
    return { error: "الرسالة لا يمكن أن تكون فارغة" };
  }

  const supabase = getAdminSupabase();

  const { error } = await supabase.from("messages").insert({
    name,
    phone,
    message,
    is_read: false
  });

  if (error) {
    console.error("Error inserting message:", error);
    return { error: "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى." };
  }

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/admin/messages");
  revalidatePath("/admin");

  return { success: true };
}
