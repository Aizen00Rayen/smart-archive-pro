import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-hero grid place-items-center shadow-glow">
            <ShieldCheck className="size-5 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-foreground">أرشيف بلدي ذكي</div>
            <div className="text-[10px] text-muted-foreground tracking-wide">SMART MUNICIPAL ARCHIVE</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-smooth">المزايا</a>
          <a href="#how" className="hover:text-foreground transition-smooth">آلية العمل</a>
          <a href="#impact" className="hover:text-foreground transition-smooth">الأثر</a>
          <Link to="/dashboard" className="hover:text-foreground transition-smooth">لوحة التحكم</Link>
        </nav>
        <Link to="/dashboard" className="hidden md:inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth shadow-elegant">
          الدخول
        </Link>
      </div>
    </header>
  );
}
