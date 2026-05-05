import { useParams } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactFooter } from "@/components/ContactFooter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { Ruler, X, ZoomIn, Facebook } from "lucide-react";
import { useState } from "react";

function getCategoryName(cat: string) {
  const map: Record<string, string> = {
    children: "غرف الأطفال",
    adult: "غرف الكبار",
    living: "الانتريهات والركن",
    videos: "الفيديوهات",
  };
  return map[cat] || "الأقسام";
}

export default function ProductDetail() {
  const { id } = useParams();
  const productId = parseInt(id || "0", 10);

  const { data: product, isLoading } = useGetProduct(productId, {
    query: {
      enabled: !!productId,
      queryKey: ["/api/products", productId],
    },
  });

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader backHref="/" backLabel="الرجوع" />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-1/3 mx-auto" />
            </div>
          ))}
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader backHref="/" backLabel="الرجوع" />
        <main className="flex-1 flex items-center justify-center">
          <h2 className="text-2xl text-muted-foreground">المنتج غير موجود</h2>
        </main>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

  const measureParts = product.measurements
    ? product.measurements.split("|").map((s) => s.trim()).filter(Boolean)
    : [];

  const imageMeasurements = images.map((_, idx) => measureParts[idx] || null);
  const extraMeasurements = measureParts.slice(images.length);

  const pieceLabelMap: Record<string, string> = {
    دولاب: "الدولاب",
    سرير: "السرير",
    كمود: "الكمود",
    بانكيت: "البانكيت",
    تسريحة: "التسريحة",
    كنبة: "الكنبة",
    كرسي: "الكرسي",
    ركنة: "الركنة",
    بوفيه: "البوفيه",
    مكتب: "المكتب",
    طاولة: "الطاولة",
  };

  function getPieceLabel(measurement: string): string {
    if (!measurement) return "قطعة";
    for (const key of Object.keys(pieceLabelMap)) {
      if (measurement.includes(key)) return pieceLabelMap[key];
    }
    return "قطعة";
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader
        backHref={`/${product.category}`}
        backLabel={`الرجوع إلى ${getCategoryName(product.category)}`}
        title={product.name}
      />

      <main className="flex-1 max-w-2xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <Badge className="bg-primary text-primary-foreground font-bold px-4 py-1.5 text-sm sm:text-base border-none shadow-lg mb-3 inline-block">
            خصم 20%
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              {product.description}
            </p>
          )}
          {product.price && (
            <p className="text-xl sm:text-2xl font-bold text-primary mt-3">
              {product.price.toLocaleString("ar-EG")} جنيه
            </p>
          )}
        </motion.div>

        {/* Scrollable image sections */}
        <div className="space-y-10 sm:space-y-16">
          {images.length > 0 ? (
            images.map((img, idx) => {
              const measure = imageMeasurements[idx];
              const pieceLabel = measure ? getPieceLabel(measure) : null;
              return (
                <motion.section
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className="space-y-3 sm:space-y-4"
                >
                  {pieceLabel && (
                    <div className="flex items-center gap-3 justify-center">
                      <div className="h-px flex-1 bg-primary/30" />
                      <span className="text-primary font-bold text-base sm:text-lg px-3 sm:px-4">
                        {pieceLabel}
                      </span>
                      <div className="h-px flex-1 bg-primary/30" />
                    </div>
                  )}

                  <div
                    className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 cursor-zoom-in group"
                    style={{ background: "#111" }}
                    onClick={() => setLightboxImg(img)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} — ${pieceLabel || idx + 1}`}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      style={{ maxHeight: "75vh" }}
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/60 text-white/80 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      تكبير
                    </div>
                  </div>

                  {measure && (
                    <div className="flex items-center gap-3 bg-card border border-border/60 rounded-xl px-4 sm:px-5 py-3 sm:py-4">
                      <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-xs text-muted-foreground block mb-0.5">المقاس</span>
                        <span className="text-foreground font-semibold text-sm sm:text-base">{measure}</span>
                      </div>
                    </div>
                  )}
                </motion.section>
              );
            })
          ) : (
            <div className="text-center py-20 text-muted-foreground">لا توجد صور لهذا المنتج</div>
          )}

          {extraMeasurements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-primary/30 rounded-2xl p-4 sm:p-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg mb-3 sm:mb-4">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
                باقي المقاسات
              </div>
              {extraMeasurements.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">{m}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-16 space-y-3 sm:space-y-4"
        >
          <a
            href={`https://wa.me/201090505685?text=${encodeURIComponent(`مرحباً، أستفسر عن: ${product.name}`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white transition-all duration-300 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg"
          >
            <SiWhatsapp className="w-5 h-5 sm:w-6 sm:h-6" />
            تواصل عبر واتساب للحجز
          </a>
          <a
            href="https://www.facebook.com/share/18UK3hesHA/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-600 text-white transition-all duration-300 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg"
          >
            <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            تابعنا على فيسبوك
          </a>
        </motion.div>
      </main>

      <ContactFooter />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-3 sm:top-4 left-3 sm:left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <motion.img
              src={lightboxImg}
              alt="تكبير الصورة"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
