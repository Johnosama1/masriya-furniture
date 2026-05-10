# المصرية للأثاث الراقي

موقع متكامل لعرض وإدارة منتجات الأثاث، مبني بـ React + Vite (Frontend) و Express + Node.js (Backend) مع قاعدة بيانات PostgreSQL.

---

## 🗂️ هيكلة المشروع

```
/
├── api/                          # Vercel Serverless Function entry
│   └── index.ts
├── artifacts/
│   ├── masriya-furniture/        # Frontend — React + Vite + Tailwind
│   │   ├── public/assets/        # الصور المرفوعة (محلياً)
│   │   └── src/
│   │       ├── components/       # مكونات مشتركة
│   │       ├── pages/            # صفحات الموقع
│   │       └── hooks/
│   └── api-server/               # Backend — Express + TypeScript
│       └── src/
│           ├── routes/           # API routes
│           └── lib/
├── lib/
│   ├── db/                       # Drizzle ORM + PostgreSQL schema
│   ├── api-spec/                 # OpenAPI spec (مصدر الحقيقة الوحيد)
│   ├── api-client-react/         # React Query hooks (auto-generated)
│   └── api-zod/                  # Zod validation schemas (auto-generated)
├── .env.example                  # مثال متغيرات البيئة
├── vercel.json                   # إعداد Vercel
└── pnpm-workspace.yaml
```

---

## ⚡ التشغيل المحلي

### المتطلبات
- Node.js 18+
- pnpm 8+
- PostgreSQL قاعدة بيانات

### الخطوات

```bash
# 1. تثبيت المتطلبات
pnpm install

# 2. إعداد متغيرات البيئة
cp .env.example .env
# عدّل DATABASE_URL في ملف .env

# 3. إنشاء جداول قاعدة البيانات
pnpm run db:push

# 4. تشغيل الخادم الخلفي (API)
pnpm run dev:api

# 5. تشغيل الواجهة الأمامية (في نافذة ثانية)
pnpm run dev:web
```

الموقع يعمل على: http://localhost:23355
الـ API يعمل على: http://localhost:8080/api

---

## 🚀 النشر على Vercel

### الطريقة الأولى — عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### الطريقة الثانية — عبر GitHub

1. ارفع المشروع على GitHub
2. افتح vercel.com واختر New Project
3. اربط المستودع
4. Vercel يكتشف الإعدادات تلقائياً من vercel.json
5. أضف متغيرات البيئة في Settings → Environment Variables:
   - DATABASE_URL — رابط قاعدة البيانات PostgreSQL
6. اضغط Deploy

### إعداد قاعدة البيانات للإنتاج

بعد إضافة DATABASE_URL على Vercel:

```bash
# تطبيق schema قاعدة البيانات (من جهازك المحلي)
DATABASE_URL=your-production-db-url pnpm run db:push
```

يمكن استخدام Neon (neon.tech) أو Supabase (supabase.com) أو Railway (railway.app) لقاعدة بيانات PostgreSQL مجانية.

---

## 📋 الأوامر المتاحة

| الأمر | الوصف |
|-------|--------|
| `pnpm install` | تثبيت جميع المتطلبات |
| `pnpm run dev:api` | تشغيل الـ API محلياً |
| `pnpm run dev:web` | تشغيل الواجهة الأمامية محلياً |
| `pnpm run build:web` | بناء الواجهة للإنتاج |
| `pnpm run db:push` | تطبيق schema قاعدة البيانات مباشرة |
| `pnpm run db:generate` | توليد ملفات migration |
| `pnpm run db:studio` | فتح Drizzle Studio لإدارة البيانات |
| `pnpm run typecheck` | فحص TypeScript |

---

## 🔌 الـ API Endpoints

| Method | Path | الوصف |
|--------|------|--------|
| GET | `/api/healthz` | فحص صحة الخادم |
| GET | `/api/products` | قائمة المنتجات مع فلترة بالقسم |
| GET | `/api/products/:id` | تفاصيل منتج |
| POST | `/api/products` | إضافة منتج جديد |
| PUT | `/api/products/:id` | تعديل منتج |
| DELETE | `/api/products/:id` | حذف منتج |
| GET | `/api/categories/summary` | ملخص الأقسام مع عدد المنتجات |
| POST | `/api/upload` | رفع صور (يعيد base64 data URLs) |

---

## 🔐 الأمان

- رمز المرور للوحة التحكم: `masriya2024`
- جميع ملفات `.env` مستبعدة من Git
- Security headers مضافة تلقائياً عبر `vercel.json`
- CORS مُعدّ للسماح بطلبات الـ API

---

## 🛠️ التقنيات المستخدمة

**Frontend:**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Framer Motion
- TanStack React Query v5
- Wouter (routing)
- Shadcn/UI components

**Backend:**
- Node.js + Express 5
- TypeScript
- Drizzle ORM
- PostgreSQL
- Zod v4 (validation)
- Multer (file uploads → base64 data URLs)

**Infrastructure:**
- pnpm Workspaces (monorepo)
- Vercel (deployment)
- OpenAPI + Orval (code generation)
