"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";
import styles from "./page.module.css";

// We use a wrapper function for the action to handle the return state
async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const result = await login(formData);
  return result || prevState;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submitBtn} disabled={pending}>
      {pending ? "جاري الدخول..." : "تسجيل الدخول"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>لوحة الإدارة</h2>
          <p>بتنجان وبس 🍆</p>
        </div>

        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              dir="ltr"
              placeholder="admin@example.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">كلمة المرور</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              dir="ltr"
            />
          </div>

          {state?.error && <div className={styles.error}>{state.error}</div>}

          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
