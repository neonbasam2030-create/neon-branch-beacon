import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileSpreadsheet, BarChart3, Menu, X, Sun, Moon, PanelRightClose, PanelRightOpen, Home } from "lucide-react";
import { ZeroLogo } from "@/components/zero-logo";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const sections = [
  { to: "/app/upload", label: "رفع ملف الإكسل", icon: FileSpreadsheet },
  { to: "/app/reports", label: "تقارير الوكلاء", icon: BarChart3 },
] as const;

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  const nav = (
    <nav className="flex flex-col gap-2 p-3">
      {sections.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          onClick={() => setMobileOpen(false)}
          title={s.label}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          activeProps={{ className: "neon-box bg-muted !text-neon font-bold" }}
        >
          <s.icon className="size-5 shrink-0" />
          {!collapsed && <span>{s.label}</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="relative flex min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0" />

      {/* Desktop sidebar (right side in RTL) */}
      <aside className={`glass relative z-10 hidden shrink-0 flex-col border-l border-border transition-all duration-300 md:flex ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center gap-3 border-b border-border p-4">
          <div className="neon-box grid size-10 shrink-0 place-items-center rounded-xl bg-muted"><ZeroLogo className="logo-glow size-6" /></div>
          {!collapsed && (
            <div className="leading-tight">
              <span className="neon-text block font-display text-xl" dir="ltr">ZERO</span>
              <span className="block text-[11px] text-muted-foreground">نظام حسابات الوكلاء</span>
            </div>
          )}
        </div>
        {nav}
        <div className="mt-auto space-y-2 border-t border-border p-3">
          <Link to="/" title="الرئيسية" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Home className="size-5" />{!collapsed && "الصفحة الرئيسية"}</Link>
          <button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            {collapsed ? <PanelRightOpen className="size-5" /> : <PanelRightClose className="size-5" />}
            {!collapsed && "طي القائمة"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="glass absolute inset-y-0 right-0 w-64 border-l border-border">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="neon-text font-display text-xl" dir="ltr">ZERO</span>
              <button onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة"><X className="size-5" /></button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setMobileOpen(true)} aria-label="فتح القائمة"><Menu className="size-6" /></button>
            <span className="rounded-full border border-neon-2/40 px-3 py-1 text-[11px] text-neon-2">تسجيل الدخول تجريبي وغير مفعّل</span>
          </div>
          <button onClick={toggleTheme} aria-label="تبديل المظهر" className="neon-box grid size-10 place-items-center rounded-xl bg-muted">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </header>
        <main className="rise flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
