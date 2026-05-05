import { Link } from "wouter";
import { motion } from "framer-motion";
import { ContactFooter } from "@/components/ContactFooter";
import logoImg from "@assets/IMG-20260504-WA0131_1777938294842.jpg";

const categories = [
  { id: "children", name: "غرف الأطفال", href: "/children", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" },
  { id: "adult", name: "غرف الكبار", href: "/adult", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" },
  { id: "living", name: "الانتريهات والركن", href: "/living", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800" },
  { id: "videos", name: "الفيديوهات", href: "/videos", image: "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?auto=format&fit=crop&q=80&w=800" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      {/* Hero */}
      <header className="relative pt-8 sm:pt-12 pb-12 sm:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-5 sm:mb-8"
          >
            <img src={logoImg} alt="المصرية للأثاث الراقي" className="w-full h-full object-cover" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200 text-center tracking-tight mb-3 sm:mb-4"
          >
            المصرية للأثاث الراقي
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-primary/20 border border-primary/50 text-primary-foreground px-4 sm:px-6 py-1.5 sm:py-2 rounded-full backdrop-blur-sm shadow-lg font-bold text-base sm:text-lg md:text-xl"
          >
            <span className="text-primary font-black">خصم 20%</span> على جميع المعروضات
          </motion.div>
        </div>
      </header>

      {/* Categories Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
            >
              <Link
                href={category.href}
                className="block group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-square sm:aspect-[4/3] border border-border/50 gold-glow"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-primary transition-colors duration-300 text-center px-2">
                    {category.name}
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <ContactFooter />
    </div>
  );
}
