"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as read:", error);
    return { error: "فشل في تحديث حالة الرسالة" };
  }

  // Revalidate the messages page and dashboard to update the unread count
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting message:", error);
    return { error: "فشل في حذف الرسالة" };
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  
  return { success: true };
}
