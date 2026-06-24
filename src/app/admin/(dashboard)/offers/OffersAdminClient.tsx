"use client";

import { useState } from "react";
import { Plus, Trash2, X, Edit, Image as ImageIcon } from "lucide-react";
import { addOffer, editOffer, deleteOffer } from "./actions";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import styles from "../menu/page.module.css";
import Image from "next/image";

export default function OffersAdminClient({ initialOffers: offers }: { initialOffers: { id: string; name: string; description?: string; specialText?: string; imageUrl?: string; size: string; price: string | number; isActive: boolean; }[] }) {
  const toast = useToast();
  const confirm = useConfirm();
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specialText: "وفر 20%",
    imageUrl: "",
    size: "عادي",
    price: "",
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // --- Handlers ---
  function openAddModal() {
    setEditingOfferId(null);
    setFormData({
      name: "", description: "", specialText: "وفر 20%", imageUrl: "", size: "عادي", price: "", isActive: true
    });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  }

  function openEditModal(offer: { id: string; name: string; description?: string; specialText?: string; imageUrl?: string; size: string; price: string | number; isActive: boolean; }) {
    setEditingOfferId(offer.id);
    setFormData({
      name: offer.name,
      description: offer.description || "",
      specialText: offer.specialText || "",
      imageUrl: offer.imageUrl || "",
      size: offer.size,
      price: offer.price.toString(),
      isActive: offer.isActive
    });
    setImageFile(null);
    setImagePreview(offer.imageUrl || "");
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    if (imageFile) {
      toast.info("جاري رفع الصورة...");
      dataToSubmit.append("file", imageFile);
    }

    let result;
    if (editingOfferId) {
      result = await editOffer(editingOfferId, formData, imageFile ? dataToSubmit : null);
    } else {
      result = await addOffer(formData, imageFile ? dataToSubmit : null);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    if (result?.error) toast.error(result.error);
    else toast.success(editingOfferId ? "تم تعديل العرض بنجاح" : "تم إضافة العرض بنجاح");
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "حذف العرض",
      message: "هل تريد حذف هذا العرض نهائياً؟",
      confirmText: "نعم، احذف",
      confirmVariant: "danger",
    });
    if (!ok) return;
    const result = await deleteOffer(id);
    if (result?.error) toast.error(result.error);
    else toast.success("تم حذف العرض");
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>إدارة العروض</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
          <Plus size={20} /> إضافة عرض جديد
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {offers.map(offer => (
          <div key={offer.id} className={styles.itemCard} style={{ opacity: offer.isActive ? 1 : 0.6 }}>
            {offer.imageUrl && (
              <div style={{ position: 'relative', width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <Image src={offer.imageUrl} alt={offer.name} fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div className={styles.itemHeader}>
              <div className={styles.itemTitle}>{offer.name} {offer.isActive ? "" : "(موقوف)"}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={styles.deleteBtn} onClick={() => openEditModal(offer)} style={{ padding: '0.3rem', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                  <Edit size={16} />
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(offer.id)} style={{ padding: '0.3rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {offer.specialText && <div style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>{offer.specialText}</div>}
            <div className={styles.itemDesc}>{offer.description || "بدون وصف"}</div>
            
            <div className={styles.itemPrices}>
              <div className={styles.priceRow}>
                <span>{offer.size}</span>
                <span>{offer.price} ج</span>
              </div>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>لا توجد عروض حالياً.</p>
        )}
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingOfferId ? "تعديل العرض" : "إضافة عرض جديد"}</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>اسم العرض</label>
                <input 
                  className={styles.input} required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>الوصف (اختياري)</label>
                <textarea 
                  className={styles.input} rows={2}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>صورة العرض</label>
                <label className={styles.imageUploadLabel}>
                  {imagePreview ? (
                    <div className={styles.imagePreviewContainer}>
                      <Image src={imagePreview} alt="preview" fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                      <div className={styles.imageOverlay}>
                        <ImageIcon size={24} />
                        <span>تغيير الصورة</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.imageUploadPlaceholder}>
                      <ImageIcon size={32} color="var(--color-text-muted)" />
                      <span>اضغط لاختيار صورة</span>
                      <small>PNG, JPG, WEBP</small>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }} 
                  />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      setImageFile(null);
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, imageUrl: "" }));
                    }}
                    style={{
                      marginTop: '0.5rem',
                      background: 'none',
                      border: '1px solid var(--color-danger, #e53e3e)',
                      color: 'var(--color-danger, #e53e3e)',
                      borderRadius: '6px',
                      padding: '0.25rem 0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      width: '100%'
                    }}
                  >
                    🗑️ حذف الصورة
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>حجم الوجبة</label>
                  <input 
                    className={styles.input} required placeholder="مثال: كومبو كبير"
                    value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} 
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>السعر</label>
                  <input 
                    type="number" className={styles.input} required 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>نص مميز (Badge)</label>
                <input 
                  className={styles.input} placeholder="مثال: خصم 20%"
                  value={formData.specialText} onChange={e => setFormData({...formData, specialText: e.target.value})} 
                />
              </div>

              <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }}
                />
                <label htmlFor="isActive" style={{ cursor: 'pointer', margin: 0 }}>تفعيل العرض للزوار</label>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "حفظ العرض"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
