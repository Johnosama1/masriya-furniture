import { SiWhatsapp, SiFacebook } from "react-icons/si";

export function ContactFooter() {
  return (
    <footer className="mt-12 py-12 border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-xl font-bold text-primary mb-6">تواصل معنا</h3>
        <div className="flex justify-center gap-6">
          <a
            href="https://wa.me/201090505685"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-primary/20 hover:border-primary gold-glow"
          >
            <SiWhatsapp className="w-5 h-5" />
            <span className="font-semibold">واتساب</span>
          </a>
          <a
            href="https://www.facebook.com/share/18UK3hesHA/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-[#1877F2] hover:text-white transition-all duration-300 border border-primary/20 hover:border-[#1877F2] gold-glow"
          >
            <SiFacebook className="w-5 h-5" />
            <span className="font-semibold">فيسبوك</span>
          </a>
        </div>
        <p className="mt-8 text-muted-foreground text-sm">
          المصرية للأثاث الراقي © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
