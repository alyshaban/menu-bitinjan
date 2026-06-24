"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./ConfirmDialog.module.css";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  confirmVariant?: "danger" | "primary";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: ((v: boolean) => void) | null;
  }>({ isOpen: false, options: { message: "" }, resolve: null });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ isOpen: true, options, resolve });
    });
  }, []);

  const handleClose = (value: boolean) => {
    state.resolve?.(value);
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.isOpen && (
        <div className={styles.overlay} onClick={() => handleClose(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.iconWrap}>
              <AlertTriangle size={28} color="#f87171" />
            </div>
            <h3 className={styles.title}>{state.options.title || "تأكيد العملية"}</h3>
            <p className={styles.message}>{state.options.message}</p>
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => handleClose(false)}>
                إلغاء
              </button>
              <button
                className={`${styles.confirmBtn} ${state.options.confirmVariant === "danger" ? styles.danger : styles.primary}`}
                onClick={() => handleClose(true)}
              >
                {state.options.confirmText || "تأكيد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx.confirm;
}
