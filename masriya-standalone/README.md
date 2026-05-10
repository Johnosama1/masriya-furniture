# المصرية للأثاث الراقي

موقع متجر أثاث احترافي — فرونت اند React + باك اند Node.js/Express + قاعدة بيانات PostgreSQL.

---

## ⚡ تشغيل المشروع محلياً

### المتطلبات
- **Node.js** v18 أو أحدث → [nodejs.org](https://nodejs.org)
- **قاعدة بيانات PostgreSQL** (Neon.tech أو Supabase أو محلي)

### الخطوات

```bash
# 1. انسخ متغيرات البيئة
cp .env.example .env
# ثم عدّل DATABASE_URL في ملف .env

# 2. ثبّت المكتبات
npm install

# 3. أنشئ جداول قاعدة البيانات
npm run db:push

# 4. شغّل الفرونت اند والباك اند معاً
npm run dev
```

سيفتح الموقع على: **http://localhost:3000**  
الـ API يعمل على: **http://localhost:8080/api**

---

## 📁 هيكل المشروع

```
masriya-furniture/
├── client/                   # الفرونت اند — React + Vite + TypeScript
│   ├── public/
│   │   └── assets/
│   │       └── logo.jpg      # شعار المتجر
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # مكونات shadcn/ui (Button, Input, Dialog...)
│   │   │   ├── ProductCard.tsx
│   │   │   ├── SiteHeader.tsx
│   │   │   └── ContactFooter.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx      # الصفحة الرئيسية
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── AdminPage.tsx # لوحة التحكم
│   │   ├── lib/
│   │   │   ├── api-client.ts # React Query hooks للتواصل مع الـ API
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   └── use-toast.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                   # الباك اند — Express + Node.js + TypeScript
│   └── src/
│       ├── index.ts          # نقطة الدخول (تشغيل محلي)
│       ├── app.ts            # Express app
│       ├── db.ts             # Drizzle ORM + Schema قاعدة البيانات
│       ├── lib/
│       │   └── logger.ts
│       └── routes/
│           ├── index.ts
│           ├── health.ts     # GET /api/healthz
│           ├── products.ts   # CRUD /api/products
│           ├── categories.ts # GET /api/categories/summary
│           └── upload.ts     # POST /api/upload (صور base64)
│
├── api/
│   └── index.ts              # Vercel Serverless Function entry
│
├── package.json              # كل المكتبات + scripts
├── tsconfig.json             # TypeScript config
├── tsconfig.server.json      # TypeScript config للباك اند
├── drizzle.config.ts         # إعداد Drizzle ORM
├── vercel.json               # إعداد Vercel للنشر
├── .env.example              # نموذج متغيرات البيئة
└── .gitignore
```

---

## 🔧 الـ Scripts المتاحة

| الأمر | الوظيفة |
|-------|---------|
| `npm run dev` | شغّل الفرونت اند والباك اند معاً |
| `npm run dev:client` | فرونت اند فقط (port 3000) |
| `npm run dev:server` | باك اند فقط (port 8080) |
| `npm run build` | ابنِ الفرونت اند للنشر |
| `npm run db:push` | طبّق التغييرات على قاعدة البيانات |
| `npm run db:generate` | أنشئ ملفات Migration |
| `npm run db:studio` | افتح Drizzle Studio لعرض البيانات |
| `npm run typecheck` | تحقق من أخطاء TypeScript |

---

## 🌐 النشر على Vercel

### الخطوة 1 — قاعدة البيانات
أنشئ قاعدة بيانات PostgreSQL مجانية على [Neon.tech](https://neon.tech) واحفظ الـ `DATABASE_URL`.

### الخطوة 2 — GitHub
ارفع المشروع على GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/masriya-furniture.git
git push -u origin main
```

### الخطوة 3 — Vercel
1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اختر الـ repository
3. في **Environment Variables** أضف:
   - `DATABASE_URL` = رابط PostgreSQL من Neon
   - `NODE_ENV` = `production`
4. اضغط **Deploy**

---

## 🔐 لوحة التحكم الإدارية

الرابط: `/admin`  
كلمة المرور: `masriya2024`

> لتغيير كلمة المرور: عدّل `ADMIN_PASSWORD` في `client/src/pages/AdminPage.tsx`

---

## 🛠️ إضافة المنتجات

1. اذهب إلى `/admin`
2. أدخل كلمة المرور
3. اضغط "إضافة" وعبّئ البيانات
4. ارفع الصور مباشرة من جهازك

---

## 💻 إعداد محرر الكود

### VS Code / Cursor
المشروع يعمل مباشرة في VS Code بدون إعداد إضافي. الإضافات المقترحة:
- **TypeScript + JavaScript** (مدمجة)
- **Tailwind CSS IntelliSense**
- **ESLint**
- **Prettier**

### WebStorm / IntelliJ
افتح المجلد مباشرة. TypeScript و Node.js مدعومان افتراضياً.

---

## 🗄️ API Endpoints

| الطريقة | الرابط | الوظيفة |
|---------|--------|---------|
| `GET` | `/api/healthz` | فحص صحة الخادم |
| `GET` | `/api/products` | كل المنتجات |
| `GET` | `/api/products?category=children` | منتجات قسم معين |
| `GET` | `/api/products/:id` | منتج واحد |
| `POST` | `/api/products` | إضافة منتج |
| `PUT` | `/api/products/:id` | تعديل منتج |
| `DELETE` | `/api/products/:id` | حذف منتج |
| `GET` | `/api/categories/summary` | ملخص الأقسام |
| `POST` | `/api/upload` | رفع صور |

---

## 🔗 التقنيات المستخدمة

**الفرونت اند:**
- React 19 + TypeScript
- Vite (بناء سريع)
- Tailwind CSS v4
- Framer Motion (animations)
- TanStack Query (إدارة البيانات)
- shadcn/ui (مكونات جاهزة)
- Wouter (routing خفيف)

**الباك اند:**
- Node.js + Express 5
- TypeScript
- Drizzle ORM (قاعدة البيانات)
- PostgreSQL
- Multer (رفع الملفات)
- Zod (التحقق من البيانات)
- Pino (logging)
