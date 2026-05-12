import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-gradient-hero grid place-items-center">
            <ShieldCheck className="size-5 text-gold" />
          </div>
          <div className="text-sm">
            <div className="font-display font-bold text-foreground">نظام أرشيف بلدي ذكي</div>
            <div className="text-xs text-muted-foreground">© 2025 — الجمهورية الجزائرية الديمقراطية الشعبية</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">مصمم بأعلى معايير الأمن السيبراني والسيادة الرقمية</div>
      </div>
    </footer>
  );
}
