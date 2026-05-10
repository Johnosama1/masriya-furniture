import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center space-y-4 px-4">
        <h1 className="text-6xl font-black text-primary">404</h1>
        <h2 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h2>
        <p className="text-muted-foreground">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
