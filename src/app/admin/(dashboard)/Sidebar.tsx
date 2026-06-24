"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../login/actions";
import { Home, LayoutList, Flame, Mail, Menu, ExternalLink, LogOut, Settings } from "lucide-react";
import styles from "./layout.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderBrand}>
          <h2>لوحة التحكم</h2>
        </div>
        <button className={styles.hamburgerBtn} onClick={toggleSidebar} aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className={styles.backdrop} onClick={closeSidebar}></div>
      )}

      {/* Sidebar Content */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2>لوحة التحكم</h2>
          <p>بتنجان وبس 🍆</p>
        </div>

        <nav className={styles.nav}>
          <Link
            href="/admin"
            className={`${styles.navLink} ${pathname === "/admin" ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <Home size={20} /> الرئيسية
          </Link>
          <Link
            href="/admin/menu"
            className={`${styles.navLink} ${pathname.startsWith("/admin/menu") ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <LayoutList size={20} /> إدارة المنيو
          </Link>
          <Link
            href="/admin/offers"
            className={`${styles.navLink} ${pathname.startsWith("/admin/offers") ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <Flame size={20} /> العروض
          </Link>
          <Link
            href="/admin/messages"
            className={`${styles.navLink} ${pathname.startsWith("/admin/messages") ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <Mail size={20} /> الرسائل
          </Link>
          <Link
            href="/admin/settings"
            className={`${styles.navLink} ${pathname.startsWith("/admin/settings") ? styles.active : ""}`}
            onClick={closeSidebar}
          >
            <Settings size={20} /> الإعدادات
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginLeft: '0.5rem' }} />
              تسجيل الخروج
            </button>
          </form>
          <div className={styles.viewSite}>
            <Link href="/" target="_blank" onClick={closeSidebar}>
              عرض الموقع <ExternalLink size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
