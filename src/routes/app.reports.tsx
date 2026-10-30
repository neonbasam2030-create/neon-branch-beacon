import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/app/reports")({
  head: () => ({
    meta: [
      { title: "تقارير الوكلاء — ZERO" },
      { name: "description", content: "تقارير حسابات الوكلاء في نظام ZERO." },
      { property: "og:title", content: "تقارير الوكلاء — ZERO" },
      { property: "og:description", content: "تقارير حسابات الوكلاء في نظام ZERO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="flex items-center gap-3 font-display text-3xl"><BarChart3 className="size-8 text-neon" /> تقارير الوكلاء</h1>
      <p className="mt-2 text-muted-foreground">ستظهر هنا تقارير الوكلاء من بيانات ملفات الإكسل التي ترفعها.</p>
      <div className="glass neon-box mt-8 rounded-2xl p-12 text-center text-muted-foreground">
        لا توجد بيانات بعد — ارفع ملف إكسل أولًا.
      </div>
    </div>
  );
}
