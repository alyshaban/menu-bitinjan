# 🍆 بتنجان وبس (Menu-Bitinjan)

تطبيق ويب متكامل لإدارة وعرض قوائم الطعام (المنيو) والعروض الخاصة بالمطاعم، مبني بأحدث تقنيات الويب **Next.js 15 (App Router)** و **Supabase**.

![صورة المشروع](/public/hero-bg.jpg)

## 🌟 المميزات (Features)

- **واجهة مستخدم عصرية وسريعة:** تصميم متجاوب (Responsive) يعمل بشكل مثالي على جميع الأجهزة (الموبايل، التابلت، والكمبيوتر).
- **منيو ديناميكي (Dynamic Menu):** عرض الأقسام والأصناف بشكل منظم مع إمكانية تحديد أحجام وأسعار متعددة للصنف الواحد.
- **عروض حصرية (Offers Slider):** شريط تمرير (Slider) لعرض أحدث العروض بشكل جذاب للزوار.
- **لوحة تحكم متكاملة (Admin Dashboard):**
  - إضافة، تعديل، وحذف أقسام المنيو.
  - إدارة الأصناف وأسعارها وصورها.
  - التحكم في العروض الحصرية (تفعيل/إيقاف).
  - إدارة إعدادات الموقع العامة (رقم الواتساب، رسالة الطلب، النص الترحيبي).
- **الطلب المباشر:** زر يربط الزائر مباشرة برقم واتساب المطعم مع رسالة جاهزة للطلب.
- **إدارة الصور:** رفع وتخزين صور الأصناف والعروض تلقائياً على **Supabase Storage**.

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **إطار العمل:** [Next.js (React)](https://nextjs.org/)
- **لغة البرمجة:** [TypeScript](https://www.typescriptlang.org/)
- **قاعدة البيانات والتخزين (Backend/Storage):** [Supabase](https://supabase.com/)
- **التصميم وتنسيق الواجهات:** CSS Modules (Vanilla CSS)
- **الأيقونات:** [Lucide React](https://lucide.dev/)

## 🚀 كيفية تشغيل المشروع محلياً (Local Development)

### 1. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 2. إعداد متغيرات البيئة (Environment Variables)
قم بإنشاء ملف `.env.local` في المجلد الرئيسي للمشروع، وأضف فيه مفاتيح Supabase الخاصة بك:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```
افتح المتصفح على الرابط [http://localhost:3000](http://localhost:3000) لرؤية الموقع.

---

## ☁️ النشر (Deployment)

هذا المشروع مهيأ ومُحسّن للرفع المباشر على منصة [Vercel](https://vercel.com).
عند الرفع، تأكد من إضافة متغيرات البيئة (`Environment Variables`) المذكورة أعلاه في إعدادات المشروع على Vercel.

---
**تطوير:** Shaban Aly 
