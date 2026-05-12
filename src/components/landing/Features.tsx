import { BrainCircuit, ScanLine, QrCode, Smartphone, Cloud } from "lucide-react";

const features = [
  { icon: BrainCircuit, title: "تصنيف بالذكاء الاصطناعي", desc: "خوارزميات تتعرف على نوع الوثيقة وتصنّفها تلقائياً." },
  { icon: ScanLine, title: "محرك OCR ذكي عربي–فرنسي", desc: "مُدرَّب خصيصاً على الخط الإداري الجزائري." },
  { icon: QrCode, title: "ربط QR ورقي–رقمي", desc: "كل ملف ورقي مرتبط بنسخته الرقمية بمسح واحد." },
  { icon: Smartphone, title: "تطبيق ميداني", desc: "جمع ومسح الوثائق من الميدان بهاتف الموظف." },
  { icon: Cloud, title: "نسخ سحابي ومحلي", desc: "نسخ احتياطية مزدوجة لضمان الاستمرارية." },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-secondary/40">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary mb-4">المزايا التقنية</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance">
            تقنيات حديثة في خدمة الإدارة المحلية
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl p-7 transition-smooth hover:shadow-elegant border ${
                i === 0
                  ? "bg-gradient-hero text-white border-transparent lg:row-span-2 lg:col-span-1"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              {i === 0 && <div className="absolute inset-0 grid-pattern opacity-30" />}
              <div className="relative">
                <div className={`size-12 rounded-xl grid place-items-center mb-5 ${i === 0 ? "bg-gradient-gold shadow-gold" : "bg-primary/10"}`}>
                  <Icon className={`size-6 ${i === 0 ? "text-gold-foreground" : "text-primary"}`} />
                </div>
                <h3 className={`font-display text-xl font-bold mb-2 ${i === 0 ? "text-white" : "text-foreground"}`}>{title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-white/75" : "text-muted-foreground"}`}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
