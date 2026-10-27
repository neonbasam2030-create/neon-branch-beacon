import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, FileText, ShieldCheck, Table2, Zap, Database, Radar, Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "نيون تقرير — افهم تقاريرك بلا ضجيج" },
      { name: "description", content: "مساحة عمل عربية لفحص تقارير إكسل واستكشاف أوراقها وصفوفها بوضوح ودقة." },
      { property: "og:title", content: "نيون تقرير — افهم تقاريرك بلا ضجيج" },
      { property: "og:description", content: "مساحة عمل عربية لفحص تقارير إكسل بوضوح ودقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const data = {
  branches: [
    { name: "الرياض", value: "248,300", change: "+8.4%", up: true, dot: "bg-neon" },
    { name: "جدة", value: "192,750", change: "+3.9%", up: true, dot: "bg-neon-2" },
    { name: "الدمام", value: "168,920", change: "-1.2%", up: false, dot: "bg-neon-3" },
  ],
  monthly: [
    { name: "يناير", value: "84,120", change: "+2.1%", up: true, dot: "bg-neon" },
    { name: "فبراير", value: "91,560", change: "+8.8%", up: true, dot: "bg-neon-2" },
    { name: "مارس", value: "88,030", change: "-3.9%", up: false, dot: "bg-neon-3" },
  ],
};

function Index() {
  const [tab, setTab] = useState<"branches" | "monthly">("branches");
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
  const rows = data[tab];
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="neon-box grid size-11 place-items-center rounded-xl text-neon"><FileText className="size-5" /></div>
          <span className="neon-text font-display text-2xl">نيون تقرير</span>
        </div>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {["كيف يعمل", "المزايا", "الخصوصية"].map((l) => <a key={l} href="#" className="transition hover:text-neon">{l}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label="تبديل الوضع" title="التبديل بين الوضع النهاري والليلي" className="glass neon-box grid size-10 place-items-center rounded-full text-neon transition hover:scale-110">
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          <button className="glass rounded-full px-5 py-2 text-sm transition hover:text-neon">تسجيل الدخول</button>
          <button className="pulse-glow flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">ابدأ التجربة <ArrowLeft className="size-4" /></button>
        </div>
      </header>

      <main className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-14 lg:grid-cols-2">
        <section className="rise">
          <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-neon" /> بيئة تجريبية للفرق المكتبية</p>
          <h1 className="font-display text-6xl leading-tight md:text-7xl">
            <span className="block">افهم تقاريرك.</span>
            <span className="neon-text-2 block">بلا ضجيج.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">نيون تقرير مساحة عمل عربية لفحص مجموعات تقارير إكسل، واستكشاف أوراقها وصفوفها بوضوح ودقة.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button className="neon-box flex items-center gap-3 rounded-2xl bg-primary px-7 py-4 text-lg font-bold text-primary-foreground transition hover:scale-105">استكشف العرض التجريبي <ArrowLeft className="size-5" /></button>
            <a href="#" className="text-muted-foreground transition hover:text-neon">اكتشف طريقة العمل ↙</a>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm">
            <ShieldCheck className="size-7 text-neon-3" />
            <div><b>لا يتم رفع أي ملفات</b><p className="text-muted-foreground">بيانات ثابتة وموثقة</p></div>
            <span className="h-8 w-px bg-border" /><span className="text-muted-foreground">نسخة ترحيبية ١.٠</span>
          </div>
        </section>

        <section className="rise relative" style={{ animationDelay: ".2s" }}>
          <div className="glass neon-box float rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex rounded-full bg-muted p-1 text-sm">
                {(["branches", "monthly"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 transition ${tab === t ? "bg-primary font-bold text-primary-foreground" : "text-muted-foreground"}`}>
                    {t === "branches" ? "أداء الفروع" : "المبيعات الشهرية"}
                  </button>
                ))}
              </div>
              <Table2 className="size-5 text-neon" />
            </div>
            <div className="my-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">ملخص التقرير</h2>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-neon-3">● جاهز للفحص</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat v="12,480" l="صفاً في المجموعة" />
              <Stat v="06" l="أوراق عمل" />
              <div className="flex items-end justify-center gap-1.5 rounded-2xl bg-muted p-4">
                {[40, 65, 50, 85, 60, 95, 70].map((h, i) => (
                  <span key={i} className="bar w-2 rounded-full bg-neon" style={{ height: h * 0.6, animationDelay: `${i * 0.15}s`, boxShadow: "var(--glow)" }} />
                ))}
              </div>
            </div>
            <table className="mt-5 w-full overflow-hidden rounded-2xl text-sm">
              <thead className="bg-muted text-muted-foreground"><tr><th className="p-3 text-right font-normal">البند</th><th className="p-3 text-right font-normal">القيمة</th><th className="p-3 text-right font-normal">التغير</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-t border-border transition hover:bg-muted/50">
                    <td className="p-3"><span className={`ml-2 inline-block size-2 rounded-full ${r.dot}`} />{r.name}</td>
                    <td className="p-3 tabular-nums">{r.value}</td>
                    <td className={`p-3 tabular-nums ${r.up ? "text-neon-3" : "text-destructive"}`} dir="ltr">{r.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl p-4">
            <div className="grid size-10 place-items-center rounded-full bg-neon-3 text-primary-foreground"><Check className="size-5" /></div>
            <div><b>كل ورقة في مكانها</b><p className="text-xs text-muted-foreground">بيانات مرتبة للفحص</p></div>
          </div>
        </section>
      </main>

      <section className="relative mx-auto grid max-w-6xl gap-6 px-6 pb-20 pt-10 md:grid-cols-3">
        {[
          { i: Zap, t: "فحص فوري", d: "افتح التقرير واستعرض ملخصه خلال ثوانٍ." },
          { i: Radar, t: "رصد التغيرات", d: "اكتشف الارتفاع والانخفاض في كل بند." },
          { i: Database, t: "بيانات محلية", d: "بيانات تجريبية ثابتة دون أي خادم." },
        ].map(({ i: Icon, t, d }, k) => (
          <div key={t} className="glass rise rounded-3xl p-6 transition hover:-translate-y-1 hover:neon-box" style={{ animationDelay: `${0.3 + k * 0.1}s` }}>
            <Icon className="size-7 text-neon-2" />
            <h3 className="mt-4 text-lg font-bold">{t}</h3>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="neon-text text-2xl font-black tabular-nums">{v}</div>
      <div className="mt-1 text-xs text-muted-foreground">{l}</div>
    </div>
  );
}
