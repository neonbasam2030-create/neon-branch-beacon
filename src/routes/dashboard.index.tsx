import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileBarChart, Upload } from "lucide-react";
import { useFiles } from "@/components/dashboard/files-context";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { files } = useFiles();
  const excel = files.filter((f) => f.kind === "excel").length;
  const pdf = files.filter((f) => f.kind === "pdf").length;

  const sections = [
    {
      to: "/dashboard/uploads" as const,
      title: "رفع الملفات",
      desc: "ارفع ملفات إكسل أو PDF واستعرضها في مساحة مستقلة.",
      icon: Upload,
      stat: `${files.length} ملف`,
      accent: "text-neon",
    },
    {
      to: "/dashboard/reports" as const,
      title: "التقارير",
      desc: "ملخص الملفات المرفوعة وتوزيعها حسب النوع والحجم.",
      icon: FileBarChart,
      stat: `${excel} إكسل · ${pdf} PDF`,
      accent: "text-neon-2",
    },
  ];

  return (
    <div className="rise mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold md:text-3xl">لوحة التحكم</h1>
      <p className="mt-1 text-sm text-muted-foreground">اختر القسم الذي تريد العمل عليه.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map(({ to, title, desc, icon: Icon, stat, accent }) => (
          <Link key={to} to={to} className="glass group flex flex-col rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--glow)]">
            <div className="flex items-center justify-between">
              <span className={`grid size-12 place-items-center rounded-xl bg-muted ${accent}`}>
                <Icon className="size-6" aria-hidden />
              </span>
              <span className="text-xs text-muted-foreground">{stat}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            <span className={`mt-4 flex items-center gap-1 text-sm font-bold ${accent}`}>
              فتح القسم <ArrowLeft className="size-4 transition group-hover:-translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
