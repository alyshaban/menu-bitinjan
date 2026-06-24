"use client";

import { useTransition } from "react";
import { markAsRead, deleteMessage } from "./actions";
import { Check, Trash2, User, Phone, Clock } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import styles from "./page.module.css";

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessageCard({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const confirm = useConfirm();

  const handleMarkAsRead = () => {
    startTransition(async () => {
      const result = await markAsRead(message.id);
      if (result?.error) toast.error(result.error);
      else toast.success("تم تحديد الرسالة كمقروءة");
    });
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "حذف الرسالة",
      message: "هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع.",
      confirmText: "احذف الرسالة",
      confirmVariant: "danger",
    });
    if (!ok) return;
    startTransition(async () => {
      const result = await deleteMessage(message.id);
      if (result?.error) toast.error(result.error);
      else toast.success("تم حذف الرسالة");
    });
  };

  // Format date
  const date = new Date(message.created_at);
  const formattedDate = new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return (
    <div className={`${styles.messageCard} ${!message.is_read ? styles.unread : ""}`}>
      <div className={styles.messageInfo}>
        <div className={styles.infoItem}>
          <User size={16} />
          الاسم: <span>{message.name || "غير محدد"}</span>
        </div>
        <div className={styles.infoItem}>
          <Phone size={16} />
          الهاتف: <span dir="ltr">{message.phone || "غير محدد"}</span>
        </div>
        <div className={styles.infoItem}>
          <Clock size={16} />
          التاريخ: <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className={styles.messageContent}>
        {message.message}
      </div>

      <div className={styles.actions}>
        {!message.is_read && (
          <button 
            className={`${styles.btn} ${styles.btnRead}`} 
            onClick={handleMarkAsRead}
            disabled={isPending}
          >
            <Check size={16} /> 
            {isPending ? "جاري التحديث..." : "تحديد كمقروءة"}
          </button>
        )}
        <button 
          className={`${styles.btn} ${styles.btnDelete}`} 
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 size={16} /> حذف
        </button>
      </div>
    </div>
  );
}
