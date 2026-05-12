import { useEffect, useMemo, useState } from "react";
import { Search, Upload, FileText, Folder, Activity, ShieldCheck, Filter, MoreVertical, FileSearch } from "lucide-react";
import { supabase, type DocumentRow } from "@/lib/supabase";
import { UploadModal } from "./UploadModal";

const MOCK: DocumentRow[] = [
  { id: "1", title: "قرار بلدي بشأن تنظيم الأسواق", reference: "2024/187", category: "قرار بلدي", status: "مؤرشف", created_at: "2024-11-12" },
  { id: "2", title: "محضر اجتماع المجلس الشعبي", reference: "2024/PV-44", category: "محضر اجتماع", status: "قيد المراجعة", created_at: "2024-11-08" },
  { id: "3", title: "عقد ميلاد - دائرة 03", reference: "EC-9921", category: "وثيقة الحالة المدنية", status: "مؤرشف", created_at: "2024-10-30" },
  { id: "4", title: "اتفاقية شراكة مع الجامعة", reference: "CT-2024/12", category: "عقد إداري", status: "مؤرشف", created_at: "2024-10-21" },
  { id: "5", title: "قرار تعيين رئيس مصلحة", reference: "2024/172", category: "قرار بلدي", status: "مؤرشف", created_at: "2024-10-15" },
];

export function Dashboard() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("id,title,reference,category,status,created_at")
      .order("created_at", { ascending: false });
    if (error || !data) {
      setDocs(MOCK);
      setUsingMock(true);
    } else {
      setDocs(data as DocumentRow[]);
      setUsingMock(data.length === 0);
      if (data.length === 0) setDocs(MOCK);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return docs;
    const q = query.toLowerCase();
    return docs.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.reference.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }, [docs, query]);

  return (
    <div className="min-h-screen bg-secondary/30 pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">مرحباً بك في</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">لوحة تحكم الأرشيف البلدي</h1>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth shadow-elegant">
            <Upload className="size-4" />
            رفع وثيقة
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { i: FileText, l: "إجمالي الوثائق", v: docs.length.toLocaleString("ar-DZ"), c: "text-primary", bg: "bg-primary/10" },
            { i: Folder, l: "الفئات", v: new Set(docs.map(d => d.category)).size.toString(), c: "text-cyan", bg: "bg-cyan/10" },
            { i: Activity, l: "نشاط اليوم", v: "24", c: "text-gold", bg: "bg-gold/10" },
            { i: ShieldCheck, l: "حالة الأمان", v: "آمن", c: "text-primary", bg: "bg-primary/10" },
          ].map(({ i: Icon, l, v, c, bg }) => (
            <div key={l} className="bg-card rounded-2xl p-5 border border-border hover:shadow-elegant transition-smooth">
              <div className={`size-10 rounded-lg grid place-items-center ${bg} mb-3`}>
                <Icon className={`size-5 ${c}`} />
              </div>
              <div className="text-2xl font-bold text-foreground font-display">{v}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-elegant overflow-hidden">
          <div className="p-5 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في الوثائق بالعنوان، المرجع، أو الفئة..."
                className="w-full h-11 pr-10 pl-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth text-sm"
              />
            </div>
            <button className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-smooth">
              <Filter className="size-4" />
              تصفية
            </button>
          </div>

          {usingMock && (
            <div className="px-5 py-2 bg-gold/10 border-b border-gold/20 text-xs text-foreground/80">
              تُعرض بيانات توضيحية. أنشئ جدول <code className="font-mono bg-background px-1.5 py-0.5 rounded">documents</code> في Supabase لعرض البيانات الحقيقية.
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">جاري تحميل الوثائق...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-grid place-items-center size-16 rounded-2xl bg-muted mb-4">
                <FileSearch className="size-7 text-muted-foreground" />
              </div>
              <div className="font-display font-bold text-foreground">لا توجد نتائج</div>
              <div className="text-sm text-muted-foreground mt-1">جرّب بكلمة مفتاحية مختلفة.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-xs uppercase tracking-wider text-muted-foreground bg-muted/50">
                    <th className="px-5 py-3 font-medium">العنوان</th>
                    <th className="px-5 py-3 font-medium">المرجع</th>
                    <th className="px-5 py-3 font-medium">الفئة</th>
                    <th className="px-5 py-3 font-medium">الحالة</th>
                    <th className="px-5 py-3 font-medium">التاريخ</th>
                    <th className="px-5 py-3 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-t border-border hover:bg-muted/30 transition-smooth">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-primary/10 grid place-items-center">
                            <FileText className="size-4 text-primary" />
                          </div>
                          <span className="font-medium text-foreground">{d.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{d.reference}</td>
                      <td className="px-5 py-4 text-muted-foreground">{d.category}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          d.status === "مؤرشف" ? "bg-cyan/15 text-foreground" : "bg-gold/15 text-foreground"
                        }`}>
                          <span className={`size-1.5 rounded-full ${d.status === "مؤرشف" ? "bg-cyan" : "bg-gold"}`} />
                          {d.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">{d.created_at?.toString().slice(0, 10)}</td>
                      <td className="px-5 py-4">
                        <button className="size-8 rounded-lg hover:bg-muted grid place-items-center">
                          <MoreVertical className="size-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UploadModal open={open} onClose={() => setOpen(false)} onUploaded={load} />
    </div>
  );
}
