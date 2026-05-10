import { Link } from "wouter";
import type { Product } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.5) }}
      className="group"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 transition-all duration-300 gold-glow h-full flex flex-col">
          <div className="absolute top-2 right-2 z-10">
            <Badge className="bg-primary text-primary-foreground font-bold px-2 py-0.5 text-xs sm:text-sm border-none shadow-lg">
              خصم 20%
            </Badge>
          </div>

          <div className="aspect-[4/3] overflow-hidden bg-muted relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            {product.subcategory && (
              <span className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                {product.subcategory}
              </span>
            )}
          </div>

          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between relative z-20">
            <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {product.measurements ? (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-secondary/50 p-2 rounded border border-border/50 leading-relaxed">
                {product.measurements}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground mt-2 bg-secondary/50 p-2 rounded border border-border/50 text-center">
                المقاسات حسب الطلب
              </p>
            )}

            {product.price != null && (
              <p className="text-primary font-bold text-sm sm:text-base mt-2">
                {product.price.toLocaleString("ar-EG")} ج.م
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
