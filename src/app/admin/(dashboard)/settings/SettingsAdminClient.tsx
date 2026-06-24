"use client";

import { useState } from "react";
import { updateSettings } from "./actions";
import { useToast } from "@/components/admin/Toast";
import styles from "../menu/page.module.css";
import { Save } from "lucide-react";

export default function SettingsAdminClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await updateSettings(formData);
    
    setIsSubmitting(false);
    if (result?.error) toast.error(result.error);
    else toast.success("تم حفظ الإعدادات بنجاح");
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>إعدادات الموقع</h1>
      </div>

      <div style={{ background: "var(--color-surface)", padding: "2rem", borderRadius: "16px", border: "1px solid var(--color-border)", maxWidth: "800px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div className={styles.formGroup}>
            <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>رقم الواتساب للتواصل</label>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>أدخل الرقم مسبوقاً بكود الدولة (مثال: +201094921931)</p>
            <input 
              type="text" 
              className={styles.input} 
              dir="ltr"
              value={settings.whatsapp_number || ""}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>الرسالة الافتراضية للواتساب</label>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>هذه الرسالة ستظهر للعميل كرسالة مبدئية عند فتح الواتساب</p>
            <textarea 
              className={styles.input} 
              rows={2}
              value={settings.whatsapp_message || ""}
              onChange={(e) => handleChange("whatsapp_message", e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ fontWeight: "bold", fontSize: "1.1rem" }}>العبارة الترحيبية (أسفل اسم الموقع)</label>
            <input 
              type="text" 
              className={styles.input} 
              value={settings.hero_tagline || ""}
              onChange={(e) => handleChange("hero_tagline", e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isSubmitting}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}
          >
            <Save size={20} />
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </form>
      </div>
    </div>
  );
}
