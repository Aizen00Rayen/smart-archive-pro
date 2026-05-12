import { Counter } from "./Counter";
import { Building2, Timer, ShieldAlert } from "lucide-react";

export function Impact() {
  return (
    <section id="impact" className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-gold mb-4">الأثر المتوقع</div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-balance">
            أرقام تعكس حجم التحوّل
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Building2, prefix: "+", end: 1541, suffix: "", label: "بلدية في الجزائر مستهدفة" },
            { icon: Timer, prefix: "", end: 98, suffix: "%", label: "تقليص وقت استرجاع الوثائق" },
            { icon: ShieldAlert, prefix: "", end: 0, suffix: "", label: "خطر ضياع الأرشيف الرقمي" },
          ].map(({ icon: Icon, prefix, end, suffix, label }) => (
            <div key={label} className="relative rounded-2xl p-8 bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-gold/40 transition-smooth">
              <Icon className="size-8 text-gold mb-4" />
              <div className="font-display text-5xl md:text-6xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                <Counter prefix={prefix} end={end} suffix={suffix} />
              </div>
              <div className="mt-3 text-white/75 leading-relaxed">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
