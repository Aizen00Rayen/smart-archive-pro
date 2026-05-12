import { ArrowLeft, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-20 -left-40 size-[500px] rounded-full bg-primary-glow/30 blur-3xl" />
      <div className="absolute bottom-0 -right-40 size-[500px] rounded-full bg-cyan/20 blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm">
              <Sparkles className="size-4 text-gold" />
              <span className="text-white/90">مصمم خصيصاً للإدارة المحلية الجزائرية</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-[1.15] text-balance">
              نظام ذكي متكامل
              <br />
              لأرشفة <span className="bg-gradient-gold bg-clip-text text-transparent">وثائق البلدية</span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-xl text-balance">
              نظام واحد يجمع الرقمنة، التصنيف التلقائي، الربط الورقي–الرقمي،
              والبحث الذكي — مصمم خصيصاً للإدارة المحلية الجزائرية.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 h-14 px-7 rounded-xl bg-gradient-gold text-gold-foreground font-semibold shadow-gold hover:scale-[1.02] transition-smooth"
              >
                الدخول للوحة التحكم
                <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-smooth" />
              </Link>
              <button className="inline-flex items-center gap-3 h-14 px-7 rounded-xl bg-white/5 border border-white/15 backdrop-blur-sm text-white font-semibold hover:bg-white/10 transition-smooth">
                <PlayCircle className="size-5 text-cyan" />
                طلب عرض تجريبي
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-white/60">
              <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-gold" /> تشفير من الدرجة العسكرية</div>
              <div className="hidden sm:flex items-center gap-2"><ShieldCheck className="size-4 text-gold" /> استضافة سيادية</div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-gradient-gold opacity-20 blur-3xl rounded-3xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-elegant">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <div className="size-3 rounded-full bg-destructive/80" />
                <div className="size-3 rounded-full bg-gold" />
                <div className="size-3 rounded-full bg-cyan" />
                <div className="ms-auto text-xs text-white/50">archive.bladia.dz</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { l: "وثيقة مؤرشفة", v: "248,930" },
                  { l: "بحث اليوم", v: "1,204" },
                  { l: "دقة OCR", v: "99.2%" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-white/5 border border-white/10 p-3">
                    <div className="text-xl font-bold text-gold">{s.v}</div>
                    <div className="text-[10px] text-white/60 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                {["قرار بلدي رقم 2024/187", "محضر اجتماع المجلس", "عقد ميلاد - دائرة 03"].map((t, i) => (
                  <div key={t} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/5">
                    <div className="size-8 rounded bg-gradient-gold grid place-items-center text-[10px] font-bold text-gold-foreground">QR</div>
                    <div className="flex-1 text-sm text-white/85">{t}</div>
                    <div className="text-[10px] text-cyan">مؤرشف</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
