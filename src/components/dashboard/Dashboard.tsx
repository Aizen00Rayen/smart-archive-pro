import { useEffect, useMemo, useState } from "react";
import { Search, Upload, FileText, Folder, Activity, ShieldCheck, Filter, FileSearch, QrCode, Download, ScanLine, LogOut } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase, type DocumentRow } from "@/lib/supabase";
import { UploadModal } from "./UploadModal";
import { QRPreviewModal } from "./QRPreviewModal";
import { UsersAdmin } from "./UsersAdmin";
import { useAuth } from "@/hooks/use-auth";

export function Dashboard() {
  const { user, role, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [qrDoc, setQrDoc] = useState<DocumentRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setDocs(data as DocumentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", search: { mode: "login", as: "user" } });
      return;
    }
    if (user) load();
  }, [user, authLoading, navigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return docs;
    const q = query.toLowerCase();
    return docs.filter((d) =>
      d.title.toLowerCase().includes(q) ||
      d.reference.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }, [docs, query]);

  if (authLoading || !user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">جاري التحقق...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary/30 pt-20 pb-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              مرحباً، {user.email} —{" "}
              <span className={`font-semibold ${isAdmin ? "text-gold" : "text-primary"}`}>
                {isAdmin ? "مسؤول" : "مستخدم"}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">لوحة تحكم الأرشيف البلدي</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/scan" className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-smooth text-foreground">
              <ScanLine className="size-4" />
              مسح QR
            </Link>
            {isAdmin && (
              <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth shadow-elegant">
                <Upload className="size-4" />
                رفع وثيقة
              </button>
            )}
            <button onClick={async () => { await signOut(); navigate({ to: "/" }); }} className="size-11 rounded-xl border border-border hover:bg-muted grid place-items-center text-muted-foreground transition-smooth" title="خروج">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { i: FileText, l: "إجمالي الوثائق", v: docs.length.toLocaleString("ar-DZ"), c: "text-primary", bg: "bg-primary/10" },
            { i: Folder, l: "الفئات", v: new Set(docs.map(d => d.category)).size.toString(), c: "text-cyan", bg: "bg-cyan/10" },
            { i: Activity, l: "نشاط اليوم", v: docs.filter(d => new Date(d.created_at).toDateString() === new Date().toDateString()).length.toString(), c: "text-gold", bg: "bg-gold/10" },
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
                className="w-full h-11 pr-10 pl-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth text-sm text-foreground"
              />
            </div>
            <button className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-smooth text-foreground">
              <Filter className="size-4" />
              تصفية
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">جاري تحميل الوثائق...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="inline-grid place-items-center size-16 rounded-2xl bg-muted mb-4">
                <FileSearch className="size-7 text-muted-foreground" />
              </div>
              <div className="font-display font-bold text-foreground">لا توجد وثائق بعد</div>
              <div className="text-sm text-muted-foreground mt-1">
                {isAdmin ? "ابدأ برفع أول وثيقة في الأرشيف." : "لم يقم المسؤول برفع أي وثيقة بعد."}
              </div>
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
                    <th className="px-5 py-3 font-medium w-32">إجراءات</th>
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
                        <div className="flex items-center gap-1">
                          <button onClick={() => setQrDoc(d)} className="size-8 rounded-lg hover:bg-muted grid place-items-center text-primary" title="رمز QR">
                            <QrCode className="size-4" />
                          </button>
                          {d.file_url && (
                            <a href={d.file_url} target="_blank" rel="noreferrer" className="size-8 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground" title="تحميل">
                              <Download className="size-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isAdmin && <UploadModal open={open} onClose={() => setOpen(false)} onUploaded={(doc) => { load(); if (doc) setQrDoc(doc); }} />}
      <QRPreviewModal doc={qrDoc} onClose={() => setQrDoc(null)} />
    </div>
  );
}
