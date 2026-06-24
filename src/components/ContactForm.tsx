"use client";

import { useState } from "react";
import { submitContactMessage } from "@/app/actions";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAction(formData: FormData) {
    setStatus("loading");
    setErrorMessage("");

    const result = await submitContactMessage(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      setStatus("error");
    } else if (result?.success) {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <section className={styles.section}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✅</div>
          <h3>تم الإرسال بنجاح!</h3>
          <p>شكراً لك على تواصلك معنا، هنراجع رسالتك في أقرب وقت.</p>
          <button onClick={() => setStatus("idle")} className={styles.submitBtn}>
            إرسال رسالة أخرى
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.divider}></div>
        <h3 className={styles.heading}>اقتراحاتك تهمنا</h3>
        <div className={styles.divider}></div>
      </div>

      <form action={handleAction} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>الاسم (اختياري)</label>
          <input type="text" id="name" name="name" className={styles.input} placeholder="اسمك الكريم" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phone" className={styles.label}>رقم الهاتف (اختياري)</label>
          <input type="tel" id="phone" name="phone" className={styles.input} placeholder="رقم الموبايل للتواصل" dir="ltr" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="message" className={styles.label}>رسالتك *</label>
          <textarea
            id="message"
            name="message"
            className={styles.textarea}
            placeholder="اكتب اقتراحك، شكوى، أو أي حاجة تحب تقولها..."
            required
            rows={4}
          ></textarea>
        </div>

        {status === "error" && (
          <div className={styles.errorMsg}>{errorMessage}</div>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={status === "loading"}
        >
          {status === "loading" ? "جاري الإرسال..." : "إرسال الرسالة"}
        </button>
      </form>
    </section>
  );
}
