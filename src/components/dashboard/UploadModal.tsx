import { X, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function UploadModal({ open, onClose, onUploaded }: { open: boolean; onClose: () => void; onUploaded: () => void }) {
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [category, setCategory] = useState("قرار بلدي");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("documents").insert({
      title, reference, category, status: "مؤرشف",
    });
    setLoading(false);
    if (error) {
      setError("لم يتم حفظ الوثيقة (تحقق من جدول documents في Supabase).");
      return;
    }
    setTitle(""); setReference("");
    onUploaded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-elegant border border-border w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl font-bold text-foreground">رفع وثيقة جديدة</h3>
          <button onClick={onClose} className="size-9 rounded-lg hover:bg-muted grid place-items-center transition-smooth">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">عنوان الوثيقة</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth" placeholder="مثال: قرار بلدي رقم 187" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">رقم المرجع</label>
            <input required value={reference} onChange={(e) => setReference(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-2 focus:ring-ring/30 outline-none transition-smooth" placeholder="2024/187" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">الفئة</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-4 rounded-lg bg-background border border-input focus:border-primary outline-none">
              <option>قرار بلدي</option>
              <option>محضر اجتماع</option>
              <option>عقد إداري</option>
              <option>وثيقة الحالة المدنية</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
            <Upload className="size-6 mx-auto mb-2 text-primary" />
            اسحب الملف هنا أو انقر للاختيار (PDF / صورة)
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-11 rounded-lg border border-border hover:bg-muted transition-smooth font-medium">إلغاء</button>
            <button disabled={loading} type="submit" className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth disabled:opacity-50">
              {loading ? "جاري الحفظ..." : "حفظ الوثيقة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
