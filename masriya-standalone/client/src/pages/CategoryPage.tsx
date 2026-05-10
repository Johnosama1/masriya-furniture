import { useListProducts, type ListProductsCategory } from "@/lib/api-client";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactFooter } from "@/components/ContactFooter";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const categoryNames: Record<string, string> = {
  children: "غرف الأطفال",
  adult: "غرف الكبار",
  living: "الانتريهات والركن",
  videos: "الفيديوهات",
};

export default function CategoryPage({ category }: { category: string }) {
  const isValidCategory = ["children", "adult", "living", "videos"].includes(category);
  const apiCategory = isValidCategory ? (category as ListProductsCategory) : undefined;

  const { data: products, isLoading } = useListProducts(
    { category: apiCategory },
    {
      query: {
        enabled: !!apiCategory,
        queryKey: ["/api/products", { category: apiCategory }],
      },
    },
  );

  const title = categoryNames[category] || "المنتجات";

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader backHref="/" backLabel="الرجوع للرئيسية" title={title} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-10 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-3">{title}</h1>
          <div className="h-1 w-16 sm:w-24 bg-primary mx-auto rounded-full" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-xl border border-border/50 overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-9 w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <h3 className="text-xl text-muted-foreground">لا توجد منتجات حالياً في هذا القسم.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </main>

      <ContactFooter />
    </div>
  );
}
