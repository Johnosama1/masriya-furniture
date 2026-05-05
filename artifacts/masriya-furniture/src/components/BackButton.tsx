import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export function BackButton({ href, label = "الرجوع" }: { href: string; label?: string }) {
  return (
    <div className="pt-6 pb-2 px-4 max-w-7xl mx-auto w-full">
      <Link href={href} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
        <ArrowRight className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    </div>
  );
}
