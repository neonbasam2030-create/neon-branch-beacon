import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { FileBarChart, LayoutGrid, LogOut, Upload } from "lucide-react";
import { ZeroLogo } from "@/components/zero-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { FilesProvider } from "@/components/dashboard/files-context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم — ZERO" },
      { name: "description", content: "لوحة تحكم منصة ZERO: رفع ملفات إكسل وPDF وعرض التقارير." },
    ],
  }),
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutGrid, exact: true },
  { to: "/dashboard/uploads", label: "رفع الملفات", icon: Upload, exact: false },
  { to: "/dashboard/reports", label: "التقارير", icon: FileBarChart, exact: false },
] as const;

function DashboardLayout() {
  return (
    <FilesProvider>
      <div className="relative min-h-screen">
        <div className="grid-bg pointer-events-none fixed inset-0" />
        <div className="relative flex min-h-screen">
          <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-l border-border p-5 md:flex">
            <Brand />
            <nav aria-label="أقسام النظام" className="mt-10 flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon, exact }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact }}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "bg-muted !text-neon font-bold" }}
                >
                  <Icon className="size-5" aria-hidden />
                  {label}
                </Link>
              ))}
            </nav>
            <Link to="/" className="mt-auto flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground transition hover:text-neon-2">
              <LogOut className="size-5" aria-hidden /> تسجيل الخروج
            </Link>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="glass sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-8">
              <div className="md:hidden"><Brand /></div>
              <p className="hidden text-sm text-muted-foreground md:block">مرحباً بك في مساحة العمل</p>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link to="/" aria-label="تسجيل الخروج" className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:text-neon-2 md:hidden">
                  <LogOut className="size-5" />
                </Link>
              </div>
            </header>

            <main className="flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10">
              <Outlet />
            </main>
          </div>
        </div>

        <nav aria-label="أقسام النظام" className="glass fixed inset-x-0 bottom-0 z-30 flex border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden">
          {nav.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
              activeProps={{ className: "!text-neon font-bold" }}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </FilesProvider>
  );
}

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      <ZeroLogo className="logo-glow size-8 text-foreground" />
      <span className="neon-text font-display text-2xl" dir="ltr">ZERO</span>
    </Link>
  );
}
