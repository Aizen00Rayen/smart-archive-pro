import { ArrowLeft, FileWarning, SearchX, EyeOff, ShieldCheck, ScanSearch, Lock } from "lucide-react";

const items = [
  {
    pIcon: FileWarning, sIcon: ShieldCheck,
    problem: "الفوضى الورقية وضياع الوثائق",
    solution: "أرشفة رقمية آمنة",
    desc: "كل وثيقة تُمسح، تُصنّف، وتُحفظ بنسخ متعددة مع تشفير كامل.",
  },
  {
    pIcon: SearchX, sIcon: ScanSearch,
    problem: "صعوبة البحث لساعات",
    solution: "بحث عربي–فرنسي فوري ومحرك OCR",
    desc: "ابحث بالكلمة المفتاحية، التاريخ، أو رقم القرار خلال ثوانٍ.",
  },
  {
    pIcon: EyeOff, sIcon: Lock,
    problem: "غياب الرقابة",
    solution: "تتبع الوصول وصلاحيات متدرجة",
    desc: "سجل تدقيق كامل لكل عملية فتح، تعديل، أو طباعة.",
  },
];

export function ProblemSolution() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-accent text-xs font-medium text-primary mb-4">المشكلة والحل</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground text-balance">
            من فوضى الورق إلى ذكاء الأرشيف
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ pIcon: P, sIcon: S, problem, solution, desc }) => (
            <div key={problem} className="group relative bg-gradient-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-smooth hover:shadow-elegant">
              <div className="flex items-center gap-3 text-destructive mb-3">
                <div className="size-10 rounded-lg bg-destructive/10 grid place-items-center">
                  <P className="size-5" />
                </div>
                <div className="text-sm font-medium">{problem}</div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground my-4">
                <ArrowLeft className="size-4 rotate-90" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-lg bg-gradient-gold grid place-items-center shadow-gold">
                  <S className="size-5 text-gold-foreground" />
                </div>
                <div className="text-lg font-display font-bold text-foreground">{solution}</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
