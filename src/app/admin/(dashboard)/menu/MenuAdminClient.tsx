"use client";

import { useState } from "react";
import { Plus, Trash2, X, Edit, Image as ImageIcon } from "lucide-react";
import { addCategory, editCategory, deleteCategory, addMenuItem, editMenuItem, deleteMenuItem, uploadImageAction } from "./actions";
import { MenuCategory } from "@/data/menu";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import styles from "./page.module.css";
import Image from "next/image";

export default function MenuAdminClient({ initialData: categories }: { initialData: MenuCategory[] }) {
  const toast = useToast();
  const confirm = useConfirm();
  // Modals state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ title: "", sort_order: 0 });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New/Edit Item State
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    imageUrl: "",
    prices: [{ size: "عادي", price: "" }]
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // --- Handlers ---

  function openAddCatModal() {
    setEditingCategoryId(null);
    setCatFormData({ title: "", sort_order: 0 });
    setIsCatModalOpen(true);
  }

  function openEditCatModal(cat: MenuCategory) {
    setEditingCategoryId(cat.id);
    // getMenuData doesn't fetch sort_order right now, but let's default to 0 if not present
    setCatFormData({ title: cat.title, sort_order: (cat as MenuCategory & { sort_order?: number }).sort_order || 0 });
    setIsCatModalOpen(true);
  }

  async function handleSaveCategory(formData: FormData) {
    setIsSubmitting(true);
    let result;
    if (editingCategoryId) {
      result = await editCategory(editingCategoryId, formData);
    } else {
      result = await addCategory(formData);
    }
    setIsSubmitting(false);
    setIsCatModalOpen(false);
    if (result?.error) toast.error(result.error);
    else toast.success(editingCategoryId ? "تم تعديل القسم بنجاح" : "تم إضافة القسم بنجاح");
  }

  async function handleDeleteCategory(id: string) {
    const ok = await confirm({
      title: "حذف القسم",
      message: "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع أصنافه أيضاً.",
      confirmText: "نعم، احذف",
      confirmVariant: "danger",
    });
    if (!ok) return;
    const result = await deleteCategory(id);
    if (result?.error) toast.error(result.error);
    else toast.success("تم حذف القسم");
  }

  function openAddItemModal(categoryId: string) {
    setSelectedCategoryId(categoryId);
    setEditingItemId(null);
    setNewItem({ name: "", description: "", imageUrl: "", prices: [{ size: "عادي", price: "" }] });
    setImageFile(null);
    setImagePreview("");
    setIsItemModalOpen(true);
  }

  function openEditItemModal(categoryId: string, item: MenuItem) {
    setSelectedCategoryId(categoryId);
    setEditingItemId(item.id);
    setNewItem({
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      prices: item.prices.length > 0 ? [...item.prices] : [{ size: "عادي", price: "" }]
    });
    setImageFile(null);
    setImagePreview(item.imageUrl || "");
    setIsItemModalOpen(true);
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = newItem.imageUrl;

    if (imageFile) {
      toast.info("جاري رفع الصورة...");
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadedUrl = await uploadImageAction(formData);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        toast.error("فشل رفع الصورة، حاول مرة أخرى");
        setIsSubmitting(false);
        return;
      }
    }

    const itemData = { ...newItem, categoryId: selectedCategoryId, imageUrl: finalImageUrl };

    let result;
    if (editingItemId) {
      result = await editMenuItem(editingItemId, itemData);
    } else {
      result = await addMenuItem(itemData);
    }

    setIsSubmitting(false);
    setIsItemModalOpen(false);
    if (result?.error) toast.error(result.error);
    else toast.success(editingItemId ? "تم تعديل الصنف بنجاح ✓" : "تم إضافة الصنف بنجاح ✓");
  }

  async function handleDeleteItem(id: string) {
    const ok = await confirm({
      title: "حذف الصنف",
      message: "هل تريد حذف هذا الصنف نهائياً؟ لا يمكن التراجع عن هذه العملية.",
      confirmText: "احذف الصنف",
      confirmVariant: "danger",
    });
    if (!ok) return;
    const result = await deleteMenuItem(id);
    if (result?.error) toast.error(result.error);
    else toast.success("تم حذف الصنف");
  }

  // --- Render ---
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>إدارة المنيو</h1>
        <button className={styles.addBtn} onClick={openAddCatModal}>
          <Plus size={20} /> إضافة قسم جديد
        </button>
      </div>

      {/* Categories List */}
      {categories.map((cat) => (
        <section key={cat.id} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2>{cat.title}</h2>
              <button className={styles.deleteBtn} onClick={() => openEditCatModal(cat)} style={{ padding: '0.3rem', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                <Edit size={16} />
              </button>
            </div>
            <div className={styles.categoryActions}>
              <button className={styles.addItemBtn} onClick={() => openAddItemModal(cat.id)}>
                + إضافة صنف
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(cat.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className={styles.itemsGrid}>
            {cat.items.map(item => (
              <div key={item.id} className={styles.itemCard}>
                {/* Image thumbnail */}
                {item.imageUrl && (
                  <div style={{ position: 'relative', width: '100%', height: '130px', borderRadius: '8px', overflow: 'hidden' }}>
                    <Image src={item.imageUrl} alt={item.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitle}>{item.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={styles.deleteBtn} onClick={() => openEditItemModal(cat.id, item)} style={{ padding: '0.3rem', color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}>
                      <Edit size={16} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteItem(item.id)} style={{ padding: '0.3rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className={styles.itemDesc}>{item.description || "بدون وصف"}</div>
                
                <div className={styles.itemPrices}>
                  {item.prices.map((p, i) => (
                    <div key={i} className={styles.priceRow}>
                      <span>{p.size}</span>
                      <span>{p.price} ج</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {cat.items.length === 0 && (
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>هذا القسم فارغ.</p>
            )}
          </div>
        </section>
      ))}

      {/* --- Category Modal --- */}
      {isCatModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingCategoryId ? "تعديل القسم" : "قسم جديد"}</h3>
              <button className={styles.closeBtn} onClick={() => setIsCatModalOpen(false)}><X size={24} /></button>
            </div>
            <form action={handleSaveCategory}>
              <div className={styles.formGroup}>
                <label>اسم القسم</label>
                <input 
                  name="title" className={styles.input} required placeholder="مثال: الفطار..." 
                  defaultValue={catFormData.title} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>الترتيب (الأصغر يظهر أولاً)</label>
                <input 
                  name="sort_order" type="number" className={styles.input} required 
                  defaultValue={catFormData.sort_order} 
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "حفظ القسم"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Item Modal --- */}
      {isItemModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingItemId ? "تعديل الصنف" : "إضافة صنف جديد"}</h3>
              <button className={styles.closeBtn} onClick={() => setIsItemModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveItem}>
              <div className={styles.formGroup}>
                <label>اسم الصنف</label>
                <input 
                  className={styles.input} required 
                  value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>الوصف (اختياري)</label>
                <textarea 
                  className={styles.input} rows={2}
                  value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} 
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>صورة الصنف (اختياري)</label>
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
              </div>

              <div className={styles.pricesSection}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>الأسعار والأحجام</label>
                {newItem.prices.map((p, i) => (
                  <div key={i} className={styles.priceInputRow}>
                    <input 
                      className={styles.input} style={{ flex: 1 }} placeholder="الحجم (مثال: عادي)" required
                      value={p.size} 
                      onChange={e => {
                        const newPrices = [...newItem.prices];
                        newPrices[i].size = e.target.value;
                        setNewItem({...newItem, prices: newPrices});
                      }} 
                    />
                    <input 
                      type="number" className={styles.input} style={{ width: '100px' }} placeholder="السعر" required
                      value={p.price} 
                      onChange={e => {
                        const newPrices = [...newItem.prices];
                        newPrices[i].price = e.target.value;
                        setNewItem({...newItem, prices: newPrices});
                      }} 
                    />
                    {newItem.prices.length > 1 && (
                      <button 
                        type="button" className={styles.deleteBtn} style={{ padding: '0.5rem' }}
                        onClick={() => setNewItem({...newItem, prices: newItem.prices.filter((_, idx) => idx !== i)})}
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" className={styles.addPriceBtn}
                  onClick={() => setNewItem({...newItem, prices: [...newItem.prices, { size: "", price: "" }]})}
                >
                  + إضافة حجم آخر
                </button>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? "جاري الحفظ..." : "حفظ الصنف"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
