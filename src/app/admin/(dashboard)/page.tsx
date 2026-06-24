import { createClient } from "@/lib/supabase/server";
import styles from "./page.module.css";
import Link from "next/link";
import { LayoutList, Flame, Mail } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch quick stats
  const { count: itemsCount } = await supabase.from('menu_items').select('*', { count: 'exact', head: true });
  const { count: offersCount } = await supabase.from('offers').select('*', { count: 'exact', head: true });
  const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

  return (
    <div>
      <h1 className={styles.pageTitle}>نظرة عامة</h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><LayoutList size={40} color="var(--color-secondary)" /></div>
          <div className={styles.statInfo}>
            <h3>أصناف المنيو</h3>
            <p>{itemsCount || 0} صنف</p>
          </div>
          <Link href="/admin/menu" className={styles.statLink}>إدارة المنيو ←</Link>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Flame size={40} color="var(--color-secondary)" /></div>
          <div className={styles.statInfo}>
            <h3>العروض الحالية</h3>
            <p>{offersCount || 0} عرض</p>
          </div>
          <Link href="/admin/offers" className={styles.statLink}>إدارة العروض ←</Link>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><Mail size={40} color="var(--color-secondary)" /></div>
          <div className={styles.statInfo}>
            <h3>رسائل جديدة</h3>
            <p className={messagesCount && messagesCount > 0 ? styles.highlight : ''}>
              {messagesCount || 0} رسالة غير مقروءة
            </p>
          </div>
          <Link href="/admin/messages" className={styles.statLink}>عرض الرسائل ←</Link>
        </div>
      </div>
    </div>
  );
}
