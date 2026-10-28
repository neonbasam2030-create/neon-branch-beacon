import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Lock, User } from "lucide-react";
import { ZeroLogo } from "@/components/zero-logo";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "123456";

export function LoginPage({ title }: { title: string }) {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-10">
      <div className="grid-bg pointer-events-none absolute inset-0" />
            <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const username = String(data.get("username") ?? "").trim();
          const password = String(data.get("password") ?? "");
          if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
            setError(false);
            setMsg("جارٍ الدخول...");
            navigate({ to: "/dashboard" });
          } else {
            setError(true);
            setMsg("اسم المستخدم أو كلمة المرور غير صحيحة");
          }
        }}
        className="glass neon-box rise relative w-full max-w-md rounded-3xl p-8"
      >
        <div className="flex flex-col items-center text-center">
          <ZeroLogo className="logo-glow size-14 text-foreground" />
          <span className="neon-text mt-3 font-display text-3xl" dir="ltr">ZERO</span>
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
        </div>
        <label className="mt-8 block text-sm">اسم المستخدم
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 focus-within:border-neon">
            <User className="size-4 text-muted-foreground" />
            <input required name="username" dir="ltr" autoCapitalize="none" autoCorrect="off" spellCheck={false} autoComplete="username" className="w-full bg-transparent py-3 outline-none" />
          </div>
        </label>
        <label className="mt-4 block text-sm">كلمة المرور
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-muted px-3 focus-within:border-neon">
            <Lock className="size-4 text-muted-foreground" />
            <input required name="password" dir="ltr" type="password" autoComplete="current-password" className="w-full bg-transparent py-3 outline-none" />
          </div>
        </label>
        <button className="mt-6 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-[var(--glow)]">دخول</button>
        {msg && <p role={error ? "alert" : "status"} className={`mt-4 text-center text-sm ${error ? "text-destructive" : "text-neon-2"}`}>{msg}</p>}
        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground transition hover:text-neon"><ArrowRight className="size-4" /> العودة للرئيسية</Link>
      </form>
    </div>
  );
}
