import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const logoImg = "/assets/logo.jpg";

interface SiteHeaderProps {
  backHref?: string;
  backLabel?: string;
  title?: string;
}

export function SiteHeader({ backHref, backLabel = "الرجوع", title }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-sm font-medium shrink-0"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{backLabel}</span>
          </Link>
        ) : (
          <div />
        )}

        {title && (
          <span className="text-sm sm:text-base font-bold text-primary truncate text-center flex-1 px-2">
            {title}
          </span>
        )}

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xs sm:text-sm font-bold text-primary hidden sm:inline">
            المصرية للأثاث الراقي
          </span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            <img src={logoImg} alt="المصرية للأثاث الراقي" className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </header>
  );
}
