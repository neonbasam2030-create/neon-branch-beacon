import { createFileRoute, Link } from "@tanstack/react-router";
import { FileBarChart, FileSpreadsheet, FileText, HardDrive } from "lucide-react";
import { formatSize, useFiles } from "@/components/dashboard/files-context";
import { toNumber } from "@/lib/excel";

type Group = { count: number; paid: number; remaining: number };

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function DataSummary() {
  const { files } = useFiles();
  let records = 0;
  let paid = 0;
  let remaining = 0;
  let hasMoney = false;
  const byStatus = new Map<string, number>();
  const byAgent = new Map<string, Group>();

  for (const file of files) {
    for (const sheet of file.sheets ?? []) {
      const { roles } = sheet;
      if (roles.paid === undefined && roles.remaining === undefined) continue;
      hasMoney = true;
      for (const row of sheet.rows) {
        records++;
        const p = roles.paid !== undefined ? toNumber(row[roles.paid]) : 0;
        const r = roles.remaining !== undefined ? toNumber(row[roles.remaining]) : 0;
        paid += p;
        remaining += r;
        if (roles.status !== undefined) {
          const s = String(row[roles.status]).trim() || "غير محدد";
          byStatus.set(s, (byStatus.get(s) ?? 0) + 1);
        }
        if (roles.agent !== undefined) {
          const a = String(row[roles.agent]).trim() || "غير محدد";
          const g = byAgent.get(a) ?? { count: 0, paid: 0, remaining: 0 };
          byAgent.set(a, { count: g.count + 1, paid: g.paid + p, remaining: g.remaining + r });
        }
      }
    }
  }

  const hasExcel = files.some((f) => f.kind === "excel");
  if (!hasMoney) {
    return hasExcel ? (
      <p className="glass mt-4 rounded-2xl p-5 text-sm text-muted-foreground">
        لم يتم العثور على أعمدة مالية (الواصل / المتبقي) في ملفات Excel المرفوعة، لذلك لا يوجد ملخص مالي.
      </p>
    ) : null;
  }

  const statuses = [...byStatus.entries()].sort((a, b) => b[1] - a[1]);
  const agents = [...byAgent.entries()].sort((a, b) => b[1].remaining - a[1].remaining || b[1].count - a[1].count);

  return (
    <>
      <section className="glass mt-4 rounded-2xl p-5" aria-labelledby="money-heading">
        <h2 id="money-heading" className="font-bold">ملخص البيانات المالية</h2>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">السجلات</p>
            <p className="mt-1 text-xl font-bold" dir="ltr">{fmt(records)}</p>
          </div>
          <div className="rounded-xl bg-neon-3/10 p-3">
            <p className="text-xs text-muted-foreground">إجمالي الواصل</p>
            <p className="mt-1 text-xl font-bold text-neon-3" dir="ltr">{fmt(paid)}</p>
          </div>
          <div className="rounded-xl bg-destructive/10 p-3">
            <p className="text-xs text-muted-foreground">إجمالي المتبقي</p>
            <p className="mt-1 text-xl font-bold text-destructive" dir="ltr">{fmt(remaining)}</p>
          </div>
        </div>
      </section>

      {statuses.length > 0 && (
        <section className="glass mt-4 rounded-2xl p-5" aria-labelledby="status-heading">
          <h2 id="status-heading" className="font-bold">حسب حالة الجواز</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {statuses.map(([status, count]) => (
              <li key={status}>
                <div className="flex justify-between gap-3 text-sm">
                  <span dir="auto">{status}</span>
                  <span className="font-bold" dir="ltr">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-neon" style={{ width: `${(count / records) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {agents.length > 0 && (
        <section className="glass mt-4 rounded-2xl p-5" aria-labelledby="agent-heading">
          <h2 id="agent-heading" className="font-bold">حسب الوكيل</h2>
          <ul className="mt-3 divide-y divide-border">
            {agents.map(([agent, g]) => (
              <li key={agent} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-bold" dir="auto">{agent}</p>
                  <p className="text-xs text-muted-foreground">{g.count} جواز</p>
                </div>
                <div className="shrink-0 text-left" dir="ltr">
                  <p className="font-bold text-neon-3">{fmt(g.paid)}</p>
                  <p className={`text-xs ${g.remaining > 0 ? "font-bold text-destructive" : "text-muted-foreground"}`}>{fmt(g.remaining)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">الرقم الأخضر: الواصل · الأحمر: المتبقي</p>
        </section>
      )}
    </>
  );
}

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

      <DataSummary />

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
