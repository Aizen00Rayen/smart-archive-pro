import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ScanLine, FileText, ArrowRight, Camera, Download } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { supabase, type DocumentRow } from "@/lib/supabase";

type Search = { token?: string };

export const Route = createFileRoute("/scan")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  component: ScanPage,
  head: () => ({ meta: [{ title: "مسح رمز QR | الأرشيف البلدي" }] }),
});

function ScanPage() {
  const { token } = useSearch({ from: "/scan" });
  const navigate = useNavigate();
  const [doc, setDoc] = useState<DocumentRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  // If token in URL, fetch document
  useEffect(() => {
    if (!token) return;
    (async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("qr_token", token)
        .maybeSingle();
      if (error || !data) {
        setError("لم يتم العثور على وثيقة بهذا الرمز. تأكد من تسجيل الدخول.");
        setDoc(null);
      } else {
        setDoc(data as DocumentRow);
        setError(null);
      }
    })();
  }, [token]);

  const startScan = async () => {
    setError(null);
    setScanning(true);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const id = "qr-reader";
      const el = document.getElementById(id);
      if (!el) throw new Error("missing reader");
      const scanner = new Html5Qrcode(id);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decoded) => {
          await scanner.stop().catch(() => {});
          scannerRef.current = null;
          setScanning(false);
          // Extract token from URL or use raw value
          let t = decoded;
          try {
            const u = new URL(decoded);
            t = u.searchParams.get("token") ?? decoded;
          } catch {/* not a URL */}
          navigate({ to: "/scan", search: { token: t } });
        },
        () => {}
      );
    } catch (e: any) {
      setScanning(false);
      setError("تعذّر فتح الكاميرا: " + (e?.message ?? ""));
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowRight className="size-4" />
            العودة للوحة التحكم
          </Link>

          <div className="bg-card rounded-2xl shadow-elegant border border-border p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 rounded-xl bg-primary/10 grid place-items-center">
                <ScanLine className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">مسح رمز QR</h1>
                <p className="text-sm text-muted-foreground">امسح الرمز للوصول الفوري إلى الوثيقة الأرشيفية</p>
              </div>
            </div>

            {!doc && !scanning && (
              <button onClick={startScan} className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-smooth shadow-elegant">
                <Camera className="size-5" />
                ابدأ المسح بالكاميرا
              </button>
            )}

            <div id="qr-reader" className={`mt-4 rounded-xl overflow-hidden ${scanning ? "block" : "hidden"}`} />

            {scanning && (
              <button
                onClick={async () => {
                  if (scannerRef.current) await scannerRef.current.stop().catch(() => {});
                  scannerRef.current = null;
                  setScanning(false);
                }}
                className="mt-3 w-full h-11 rounded-lg border border-border hover:bg-muted text-sm font-medium text-foreground"
              >
                إيقاف
              </button>
            )}

            {error && (
              <div className="mt-4 text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
            )}

            {doc && (
              <div className="mt-6 border-t border-border pt-6">
                <div className="text-xs text-muted-foreground mb-2">تم العثور على الوثيقة</div>
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
                    <FileText className="size-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg font-bold text-foreground">{doc.title}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">{doc.reference}</div>
                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-muted text-foreground">{doc.category}</span>
                      <span className="px-2.5 py-1 rounded-full bg-cyan/15 text-foreground">{doc.status}</span>
                      <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{doc.created_at?.slice(0, 10)}</span>
                    </div>
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth">
                        <Download className="size-4" />
                        فتح الوثيقة
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
