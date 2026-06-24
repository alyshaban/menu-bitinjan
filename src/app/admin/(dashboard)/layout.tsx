import { createClient } from "@/lib/supabase/server";
import styles from "./layout.module.css";
import Sidebar from "./Sidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

export const metadata = {
  title: "لوحة تحكم بتنجان وبس",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className={styles.adminContainer}>
          <Sidebar />

          {/* Main Content */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
