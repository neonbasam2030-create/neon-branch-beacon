import { createFileRoute, Link } from "@tanstack/react-router";
import { FileBarChart, FileSpreadsheet, FileText, HardDrive } from "lucide-react";
import { formatSize, useFiles } from "@/components/dashboard/files-context";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "التقارير — ZERO" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { files } = useFiles();
  const excel = files.filter((f) => f.kind === "excel");
  const pdf = files.filter((f) => f.kind === "pdf");
  const totalSize = files.reduce((s, f) => s + f.size, 0);
  const excelPct = files.length ? Math.round((excel.length / files.length) * 100) : 0;

  const stats = [
    { label: "إجمالي الملفات", value: String(files.length), icon: FileBarChart, color: "text-neon" },
    { label: "ملفات Excel", value: String(excel.length), icon: FileSpreadsheet, color: "text-neon-3" },
    { label: "ملفات PDF", value: String(pdf.length), icon: FileText, color: "text-neon-2" },
    { label: "الحجم الكلي", value: formatSize(totalSize), icon: HardDrive, color: "text-neon" },
  ];

  return (
    <div className="rise mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold md:text-3xl">التقارير</h1>
      <p className="mt-1 text-sm text-muted-foreground">ملخص الملفات المرفوعة في الجلسة الحالية.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-4">
            <Icon className={`size-5 ${color}`} aria-hidden />
            <p className="mt-3 text-2xl font-bold" dir="ltr">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="glass mt-4 rounded-2xl p-5" aria-labelledby="dist-heading">
        <h2 id="dist-heading" className="font-bold">توزيع الملفات حسب النوع</h2>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={`Excel ${excelPct}%، PDF ${files.length ? 100 - excelPct : 0}%`}>
          {files.length > 0 && (
            <>
              <div className="bg-neon-3" style={{ width: `${excelPct}%` }} />
              <div className="bg-neon-2" style={{ width: `${100 - excelPct}%` }} />
            </>
          )}
        </div>
        <div className="mt-3 flex gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-neon-3" /> Excel {excelPct}%</span>
          <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-neon-2" /> PDF {files.length ? 100 - excelPct : 0}%</span>
        </div>
      </section>

      <section className="glass mt-4 rounded-2xl p-5" aria-labelledby="log-heading">
        <h2 id="log-heading" className="font-bold">سجل الملفات</h2>
        {files.length === 0 ? (
          <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-muted-foreground">لا توجد بيانات لعرضها بعد.</p>
            <Link to="/dashboard/uploads" className="flex min-h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground">ارفع أول ملف</Link>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="min-w-0 truncate" dir="auto">{f.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{f.kind === "pdf" ? "PDF" : "Excel"} · {formatSize(f.size)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
