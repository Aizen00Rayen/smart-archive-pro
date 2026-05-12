import { X, Upload, FileUp } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function UploadModal({ open, onClose, onUploaded }: { open: boolean; onClose: () => void; onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [category, setCategory] = useState("قرار بلدي");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setTitle(""); setReference(""); setCategory("قرار بلدي"); setFile(null); setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const uid = userRes.user?.id;
      if (!uid) throw new Error("يرجى تسجيل الدخول.");

      let file_url: string | null = null;
      let file_path: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop() || "bin";
        file_path = `${uid}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("documents").upload(file_path, file, {
          contentType: file.type || undefined,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("documents").getPublicUrl(file_path);
        file_url = pub.publicUrl;
      }

      const { error: insErr } = await supabase.from("documents").insert({
        title, reference, category, status: "مؤرشف",
        file_url, file_path, uploaded_by: uid,
      });
      if (insErr) throw insErr;

      reset();
      onUploaded();
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "تعذّر حفظ الوثيقة. تأكد من صلاحيات المسؤول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-elegant border border-border w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-foreground">رفع وثيقة جديدة</h3>
          <button onClick={onClose} className="size-9 rounded-lg hover:bg-muted grid place-items-center transition-smooth text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">عنوان الوثيقة</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth text-foreground" placeholder="مثال: قرار بلدي رقم 187" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">رقم المرجع</label>
            <input required value={reference} onChange={(e) => setReference(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth text-foreground" placeholder="2024/187" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">الفئة</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary outline-none text-foreground">
              <option>قرار بلدي</option>
              <option>محضر اجتماع</option>
              <option>عقد إداري</option>
              <option>وثيقة الحالة المدنية</option>
            </select>
          </div>
          <label className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground block cursor-pointer hover:border-primary hover:bg-primary/5 transition-smooth">
            {file ? (
              <>
                <FileUp className="size-6 mx-auto mb-2 text-primary" />
                <div className="text-foreground font-medium">{file.name}</div>
                <div className="text-xs mt-1">{(file.size / 1024).toFixed(0)} كيلوبايت</div>
              </>
            ) : (
              <>
                <Upload className="size-6 mx-auto mb-2 text-primary" />
                اسحب الملف هنا أو انقر للاختيار (PDF / صورة)
              </>
            )}
            <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border hover:bg-muted transition-smooth font-medium text-foreground">إلغاء</button>
            <button disabled={loading} type="submit" className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth disabled:opacity-50">
              {loading ? "جاري الحفظ..." : "حفظ الوثيقة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
