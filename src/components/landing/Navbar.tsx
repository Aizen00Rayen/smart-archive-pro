import { ShieldCheck, LogIn, UserCog, ScanLine } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-hero grid place-items-center shadow-glow">
            <ShieldCheck className="size-5 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-foreground">أرشيف بلدي ذكي</div>
            <div className="text-[10px] text-muted-foreground tracking-wide">SMART MUNICIPAL ARCHIVE</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="/#features" className="hover:text-foreground transition-smooth">المزايا</a>
          <a href="/#how" className="hover:text-foreground transition-smooth">آلية العمل</a>
          <a href="/#impact" className="hover:text-foreground transition-smooth">الأثر</a>
          <Link to="/dashboard" className="hover:text-foreground transition-smooth">لوحة التحكم</Link>
          <Link to="/scan" className="hover:text-foreground transition-smooth inline-flex items-center gap-1">
            <ScanLine className="size-4" /> مسح
          </Link>
        </nav>
        {user ? (
          <div className="hidden md:flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isAdmin ? "bg-gold/15 text-foreground" : "bg-primary/10 text-primary"}`}>
              {isAdmin ? "مسؤول" : "مستخدم"}
            </span>
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth shadow-elegant">
              لوحة التحكم
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Link to="/auth" search={{ mode: "login", as: "user" }} className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-border hover:bg-muted text-foreground text-sm font-medium transition-smooth">
              <LogIn className="size-4" />
              دخول كمستخدم
            </Link>
            <Link to="/auth" search={{ mode: "login", as: "admin" }} className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-gradient-gold text-gold-foreground text-sm font-semibold hover:opacity-95 transition-smooth shadow-gold">
              <UserCog className="size-4" />
              دخول كمسؤول
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
