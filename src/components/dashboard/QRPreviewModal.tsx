import { useEffect, useRef, useState } from "react";
import { X, Download, ExternalLink } from "lucide-react";
import QRCode from "qrcode";
import type { DocumentRow } from "@/lib/supabase";

export function QRPreviewModal({ doc, onClose }: { doc: DocumentRow | null; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const scanUrl = doc ? `${typeof window !== "undefined" ? window.location.origin : ""}/scan?token=${doc.qr_token}` : "";

  useEffect(() => {
    if (!doc || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, scanUrl, {
      width: 256, margin: 2,
      color: { dark: "#0a1530", light: "#ffffff" },
    });
    QRCode.toDataURL(scanUrl, { width: 512, margin: 2 }).then(setDataUrl);
  }, [doc, scanUrl]);

  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-elegant border border-border w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-foreground">رمز QR للوثيقة</h3>
          <button onClick={onClose} className="size-9 rounded-lg hover:bg-muted grid place-items-center text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="text-sm text-muted-foreground mb-1">{doc.title}</div>
        <div className="text-xs font-mono text-muted-foreground mb-4">{doc.reference}</div>
        <div className="bg-white rounded-xl p-4 grid place-items-center mb-4">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2">
          {dataUrl && (
            <a href={dataUrl} download={`qr-${doc.reference}.png`} className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-smooth">
              <Download className="size-4" /> تحميل
            </a>
          )}
          <a href={scanUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border border-border hover:bg-muted text-foreground">
            <ExternalLink className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
