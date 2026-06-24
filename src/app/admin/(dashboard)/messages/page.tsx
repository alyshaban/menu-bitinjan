import { createClient } from "@/lib/supabase/server";
import { Mail } from "lucide-react";
import MessageCard from "./MessageCard";
import styles from "./page.module.css";

export const metadata = {
  title: "الرسائل | لوحة تحكم بتنجان وبس",
};

export default async function MessagesPage() {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>الرسائل واقتراحات العملاء</h1>
      </div>

      {!messages || messages.length === 0 ? (
        <div className={styles.emptyState}>
          <Mail size={48} color="var(--color-text-muted)" />
          <p>لا توجد رسائل حالياً.</p>
        </div>
      ) : (
        <div className={styles.messagesList}>
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}
