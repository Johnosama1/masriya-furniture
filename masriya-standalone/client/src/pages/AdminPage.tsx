import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
} from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Tag,
  MinusCircle,
} from "lucide-react";

const logoImg = "/assets/logo.jpg";
const ADMIN_PASSWORD = "masriya2024";

type Category = "children" | "adult" | "living" | "videos";

interface ProductForm {
  name: string;
  nameEn: string;
  description: string;
  price: string;
  category: Category;
  measurements: string;
  images: string[];
  sortOrder: string;
}

const emptyForm = (): ProductForm => ({
  name: "",
  nameEn: "",
  description: "",
  price: "",
  category: "children",
  measurements: "",
  images: [],
  sortOrder: "0",
});

const categoryLabel = (c: string) =>
  c === "children" ? "غرف الأطفال" :
  c === "adult" ? "غرف الكبار" :
  c === "living" ? "الانتريهات والركن" : "فيديوهات";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) setAuthed(true);
    else toast({ title: "كلمة المرور غير صحيحة", variant: "destructive" });
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 bg-card p-8 rounded-2xl border border-border shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(212,175,55,0.3)] mx-auto mb-2">
              <img src={logoImg} alt="المصرية للأثاث الراقي" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold text-primary">المصرية للأثاث الراقي</h1>
            <p className="text-muted-foreground text-sm">أدخل كلمة المرور للدخول</p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="text-center text-lg tracking-widest"
              dir="ltr"
              autoFocus
            />
            <Button type="submit" className="w-full font-bold text-base h-11">
              دخول
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: products, isLoading } = useListProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [uploading, setUploading] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: ReturnType<typeof useListProducts>["data"] extends Array<infer T> ? T : never) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      nameEn: p.nameEn || "",
      description: p.description || "",
      price: p.price != null ? String(p.price) : "",
      category: p.category as Category,
      measurements: p.measurements || "",
      images: p.images || [],
      sortOrder: String(p.sortOrder ?? 0),
    });
    setDialogOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("images", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json() as { urls?: string[] };
      if (data.urls) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls!] }));
        toast({ title: `تم رفع ${data.urls.length} صورة بنجاح` });
      }
    } catch {
      toast({ title: "فشل رفع الصور", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "الاسم مطلوب", variant: "destructive" }); return; }
    if (!form.nameEn.trim()) { toast({ title: "الاسم الإنجليزي مطلوب", variant: "destructive" }); return; }
    if (form.images.length === 0) { toast({ title: "أضف صورة واحدة على الأقل", variant: "destructive" }); return; }

    const payload = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim(),
      description: form.description.trim(),
      price: form.price ? Number(form.price) : null,
      category: form.category,
      measurements: form.measurements.trim() || null,
      images: form.images,
      sortOrder: Number(form.sortOrder) || 0,
    };

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      setDialogOpen(false);
      toast({ title: editingId ? "تم التحديث بنجاح ✓" : "تمت الإضافة بنجاح ✓" });
    };
    const onError = () => toast({ title: "حدث خطأ، حاول مرة أخرى", variant: "destructive" });

    if (editingId) {
      updateProduct.mutate({ id: editingId, data: payload }, { onSuccess, onError });
    } else {
      createProduct.mutate({ data: payload }, { onSuccess, onError });
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`هل تريد حذف "${name}"؟`)) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "تم الحذف بنجاح" });
      },
    });
  };

  const handleTogglePrice = (p: { id: number; price: number | null }) => {
    const newPrice = p.price != null ? null : 0;
    updateProduct.mutate(
      { id: p.id, data: { price: newPrice } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
          toast({ title: p.price != null ? "تم إزالة السعر" : "تم تفعيل السعر" });
        },
      },
    );
  };

  const filtered = products?.filter((p) => filterCat === "all" || p.category === filterCat) ?? [];
  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-md gap-2" dir="rtl">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_8px_rgba(212,175,55,0.3)] shrink-0">
            <img src={logoImg} alt="الشعار" className="w-full h-full object-cover" />
          </div>
          <span className="text-base sm:text-xl font-bold text-primary">لوحة التحكم</span>
          <Badge variant="outline" className="text-muted-foreground text-xs hidden sm:flex">
            {products?.length ?? 0} منتج
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button onClick={openCreate} className="gap-1 sm:gap-1.5 font-bold text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            إضافة
          </Button>
          <Button variant="outline" size="sm" onClick={onLogout} className="gap-1 sm:gap-1.5 text-muted-foreground h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm">
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 flex-wrap mb-6">
          {[
            { val: "all", label: "الكل" },
            { val: "children", label: "أطفال" },
            { val: "adult", label: "كبار" },
            { val: "living", label: "انتريهات" },
            { val: "videos", label: "فيديوهات" },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => setFilterCat(t.val)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filterCat === t.val
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {t.label}
              {t.val !== "all" && (
                <span className="mr-1 opacity-60">
                  ({products?.filter((p) => p.category === t.val).length ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد منتجات</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/50 transition-all">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">لا توجد صورة</div>
                  )}
                  {p.images && p.images.length > 1 && (
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {p.images.length} صور
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {categoryLabel(p.category)}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  <h3 className="font-bold text-sm leading-tight line-clamp-1">{p.name}</h3>
                  {p.measurements && (
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.measurements}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {p.price != null ? (
                      <span className="text-primary font-bold text-sm">{p.price.toLocaleString()} ج.م</span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">بدون سعر</span>
                    )}
                    <span className="text-xs text-muted-foreground">#{p.id}</span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs h-8" onClick={() => openEdit(p)}>
                      <Pencil className="w-3 h-3" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline" size="sm" className="h-8 px-2 text-xs"
                      title={p.price != null ? "إزالة السعر" : "إضافة سعر"}
                      onClick={() => handleTogglePrice(p)}
                    >
                      {p.price != null ? <MinusCircle className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                    </Button>
                    <Button
                      variant="destructive" size="sm" className="h-8 px-2"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingId ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الصور</label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 left-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-xs py-0.5">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer disabled:opacity-50"
              >
                <ImagePlus className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "جاري الرفع..." : "اضغط لاختيار صور من جهازك"}
                </span>
                <span className="block text-xs text-muted-foreground/60 mt-0.5">يمكن اختيار أكثر من صورة دفعة واحدة</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold">الاسم بالعربي</label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="مثال: غرفة أطفال فيروزي" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">الاسم بالإنجليزي (للنظام)</label>
                <Input dir="ltr" value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} placeholder="e.g. turquoise kids room" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">الوصف</label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="وصف مختصر للمنتج..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-semibold">القسم</label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as Category }))}>
                  <SelectTrigger dir="rtl"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="children">غرف الأطفال</SelectItem>
                    <SelectItem value="adult">غرف الكبار</SelectItem>
                    <SelectItem value="living">الانتريهات والركن</SelectItem>
                    <SelectItem value="videos">الفيديوهات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">السعر (اختياري)</label>
                <Input type="number" dir="ltr" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">الترتيب (الأقل أولاً)</label>
                <Input type="number" dir="ltr" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">المقاسات</label>
              <p className="text-xs text-muted-foreground">كل قطعة في سطر منفصل، أو افصل بـ |</p>
              <Textarea
                rows={4}
                value={form.measurements}
                onChange={(e) => setForm((f) => ({ ...f, measurements: e.target.value }))}
                placeholder={"الدولاب: 2 م\nالسرير: 120 سم\nالكمود: 70 سم"}
              />
              <p className="text-xs text-muted-foreground/60">كل سطر يقابل صورة — الأول مع الصورة الأولى...</p>
            </div>

            {form.measurements && !form.measurements.includes("|") && form.measurements.includes("\n") && (
              <div className="bg-primary/10 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs text-primary">تحويل الأسطر إلى تنسيق | ؟</span>
                <Button
                  size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => setForm((f) => ({
                    ...f,
                    measurements: f.measurements.split("\n").map((s) => s.trim()).filter(Boolean).join(" | "),
                  }))}
                >
                  تحويل
                </Button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} disabled={isPending || uploading} className="font-bold min-w-24">
                {isPending ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المنتج"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
