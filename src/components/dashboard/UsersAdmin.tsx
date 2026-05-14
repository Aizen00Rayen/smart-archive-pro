import { useEffect, useState } from "react";
import { Users, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type UserRow = {
  id: string;
  full_name: string | null;
  isAdmin: boolean;
};

export function UsersAdmin({ currentUserId }: { currentUserId: string }) {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    setRows(
      (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        isAdmin: adminSet.has(p.id),
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (u: UserRow) => {
    setBusy(u.id);
    try {
      if (u.isAdmin) {
        await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "admin");
      } else {
        await supabase.from("user_roles").insert({ user_id: u.id, role: "admin" });
      }
      await load();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-elegant overflow-hidden mt-8">
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gold/10 grid place-items-center">
          <Users className="size-5 text-gold" />
        </div>
        <div>
          <div className="font-display font-bold text-foreground">إدارة المستخدمين</div>
          <div className="text-xs text-muted-foreground">منح أو سحب صلاحيات المسؤول</div>
        </div>
      </div>
      {loading ? (
        <div className="p-10 text-center text-muted-foreground text-sm">جاري التحميل...</div>
      ) : rows.length === 0 ? (
        <div className="p-10 text-center text-muted-foreground text-sm">لا يوجد مستخدمون.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs uppercase tracking-wider text-muted-foreground bg-muted/50">
                <th className="px-5 py-3 font-medium">الاسم</th>
                <th className="px-5 py-3 font-medium">الصلاحية</th>
                <th className="px-5 py-3 font-medium w-48">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const self = u.id === currentUserId;
                return (
                  <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-smooth">
                    <td className="px-5 py-4 font-medium text-foreground">
                      {u.full_name || <span className="text-muted-foreground">—</span>}
                      {self && <span className="text-xs text-muted-foreground mr-2">(أنت)</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.isAdmin ? "bg-gold/15 text-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <span className={`size-1.5 rounded-full ${u.isAdmin ? "bg-gold" : "bg-muted-foreground"}`} />
                        {u.isAdmin ? "مسؤول" : "مستخدم"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleAdmin(u)}
                        disabled={self || busy === u.id}
                        className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-smooth text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {busy === u.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : u.isAdmin ? (
                          <ShieldOff className="size-3.5" />
                        ) : (
                          <ShieldCheck className="size-3.5" />
                        )}
                        {u.isAdmin ? "سحب صلاحية المسؤول" : "منح صلاحية المسؤول"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
