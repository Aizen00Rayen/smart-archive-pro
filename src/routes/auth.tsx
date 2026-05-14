import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, User, Lock, Mail, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/landing/Navbar";

type Search = { mode?: "login" | "signup"; as?: "user" | "admin" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: (s.mode as Search["mode"]) ?? "login",
    as: (s.as as Search["as"]) ?? "user",
  }),
  component: AuthPage,
  head: () => ({ meta: [{ title: "تسجيل الدخول | الأرشيف البلدي" }] }),
});

function AuthPage() {
  const { mode, as } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const isAdmin = as === "admin";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        // All signups are regular users. Admin role is granted only by an existing admin from the dashboard.
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err?.message ?? "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-secondary/30">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-elegant border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`size-12 rounded-xl grid place-items-center ${isAdmin ? "bg-gradient-gold shadow-gold" : "bg-primary/10"}`}>
                {isAdmin ? <UserCog className="size-6 text-gold-foreground" /> : <ShieldCheck className="size-6 text-primary" />}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{isAdmin ? "حساب مسؤول" : "حساب مستخدم"}</div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {isSignup ? "إنشاء حساب" : "تسجيل الدخول"}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-6">
              <Link
                to="/auth"
                search={{ mode, as: "user" }}
                className={`text-center text-sm py-2 rounded-lg transition-smooth ${as === "user" ? "bg-card shadow-sm font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                <User className="size-4 inline ml-1.5" />
                مستخدم
              </Link>
              <Link
                to="/auth"
                search={{ mode, as: "admin" }}
                className={`text-center text-sm py-2 rounded-lg transition-smooth ${as === "admin" ? "bg-card shadow-sm font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                <UserCog className="size-4 inline ml-1.5" />
                مسؤول
              </Link>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {isSignup && (
                <Field label="الاسم الكامل" icon={<User className="size-4" />}>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="auth-input"
                    placeholder="محمد بن علي"
                  />
                </Field>
              )}
              <Field label="البريد الإلكتروني" icon={<Mail className="size-4" />}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="name@commune.dz"
                />
              </Field>
              <Field label="كلمة المرور" icon={<Lock className="size-4" />}>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                />
              </Field>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
              )}

              <button
                disabled={loading}
                type="submit"
                className={`w-full h-12 rounded-xl font-semibold text-sm transition-smooth disabled:opacity-50 ${
                  isAdmin
                    ? "bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-95"
                    : "bg-primary text-primary-foreground shadow-elegant hover:opacity-90"
                }`}
              >
                {loading ? "..." : isSignup ? "إنشاء الحساب" : "تسجيل الدخول"}
              </button>
            </form>

            <div className="text-sm text-center text-muted-foreground mt-6">
              {isSignup ? "لديك حساب؟ " : "ليس لديك حساب؟ "}
              <Link
                to="/auth"
                search={{ mode: isSignup ? "login" : "signup", as }}
                className="text-primary font-semibold hover:underline"
              >
                {isSignup ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}
