import { ScanLine, Sparkles, QrCode, Search } from "lucide-react";

const steps = [
  { n: "01", icon: ScanLine, title: "مسح ضوئي و OCR", desc: "تحويل الوثيقة الورقية إلى نص قابل للبحث." },
  { n: "02", icon: Sparkles, title: "تصنيف آلي", desc: "الذكاء الاصطناعي يحدد النوع والقسم." },
  { n: "03", icon: QrCode, title: "ربط الملف بـ QR", desc: "إصدار رمز فريد يربط الورقي بالرقمي." },
  { n: "04", icon: Search, title: "استرجاع في ثوانٍ", desc: "بحث فوري متعدد المعايير." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-medium text-primary mb-4">آلية العمل</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance">
            من الورقة إلى البيانات في 4 خطوات
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} className="relative text-center group">
                <div className="relative inline-grid place-items-center mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/30 transition-smooth" />
                  <div className="relative size-24 rounded-full bg-gradient-card border-2 border-primary/20 grid place-items-center shadow-elegant group-hover:scale-105 transition-smooth">
                    <Icon className="size-9 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 size-9 rounded-full bg-gradient-gold grid place-items-center text-xs font-bold text-gold-foreground shadow-gold">
                    {n}
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-4">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
