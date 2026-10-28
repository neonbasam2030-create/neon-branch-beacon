import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { normalizeArabic, toNumber, type CellValue, type Sheet } from "@/lib/excel";

const PAGE_SIZE = 50;

function display(value: CellValue) {
  return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

export function ExcelViewer({ sheets }: { sheets: Sheet[] }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const sheet = sheets[active];

  const filtered = useMemo(() => {
    if (!sheet) return [];
    const q = normalizeArabic(query);
    if (!q) return sheet.rows;
    return sheet.rows.filter((row) => row.some((cell) => normalizeArabic(String(cell)).includes(q)));
  }, [sheet, query]);

  if (!sheet) {
    return <p className="p-6 text-center text-sm text-muted-foreground">لا توجد بيانات في هذا الملف.</p>;
  }

  const { roles } = sheet;
  const titleIndex = roles.name ?? 0;
  const visible = filtered.slice(0, limit);
  const numericClass = (i: number) =>
    i === roles.paid ? "text-neon-3 font-bold" : i === roles.remaining ? "text-destructive font-bold" : "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-3">
        {sheets.length > 1 && (
          <div role="tablist" aria-label="أوراق الملف" className="-mx-1 flex gap-2 overflow-x-auto px-1">
            {sheets.map((s, i) => (
              <button
                key={s.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => { setActive(i); setLimit(PAGE_SIZE); }}
                className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold transition ${i === active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
        <label className="relative block">
          <span className="sr-only">بحث في البيانات</span>
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }}
            placeholder="ابحث بالاسم، رقم السند، الوكيل..."
            className="h-11 w-full rounded-xl border border-border bg-muted/50 pr-10 pl-3 text-base outline-none focus:border-neon"
          />
        </label>
        <p className="text-xs text-muted-foreground">
          {filtered.length} من {sheet.rows.length} سجل · {sheet.headers.length} عمود
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <ul className="flex flex-col gap-3 p-4 md:hidden">
          {visible.map((row, r) => (
            <li key={r} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold leading-relaxed" dir="auto">{display(row[titleIndex]) || "—"}</p>
                {roles.receipt !== undefined && row[roles.receipt] !== "" && (
                  <span className="shrink-0 rounded-lg bg-muted px-2 py-1 text-xs" dir="ltr">#{display(row[roles.receipt])}</span>
                )}
              </div>
              {(roles.paid !== undefined || roles.remaining !== undefined) && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {roles.paid !== undefined && (
                    <div className="rounded-xl bg-neon-3/10 p-2">
                      <p className="text-xs text-muted-foreground">{sheet.headers[roles.paid]}</p>
                      <p className="text-lg font-bold text-neon-3" dir="ltr">{toNumber(row[roles.paid]).toLocaleString("en-US")}</p>
                    </div>
                  )}
                  {roles.remaining !== undefined && (
                    <div className={`rounded-xl p-2 ${toNumber(row[roles.remaining]) > 0 ? "bg-destructive/10" : "bg-muted"}`}>
                      <p className="text-xs text-muted-foreground">{sheet.headers[roles.remaining]}</p>
                      <p className={`text-lg font-bold ${toNumber(row[roles.remaining]) > 0 ? "text-destructive" : ""}`} dir="ltr">
                        {toNumber(row[roles.remaining]).toLocaleString("en-US")}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                {sheet.headers.map((h, i) =>
                  [titleIndex, roles.receipt, roles.paid, roles.remaining].includes(i) || row[i] === "" ? null : (
                    <div key={i} className="contents">
                      <dt className="text-muted-foreground">{h}</dt>
                      <dd dir="auto">{display(row[i])}</dd>
                    </div>
                  ),
                )}
              </dl>
            </li>
          ))}
        </ul>

        <table className="hidden w-full text-sm md:table">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              {sheet.headers.map((h, i) => (
                <th key={i} scope="col" className="whitespace-nowrap px-3 py-3 text-right font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((row, r) => (
              <tr key={r} className="hover:bg-muted/40">
                {row.map((cell, i) => (
                  <td key={i} className={`whitespace-nowrap px-3 py-2 ${numericClass(i)}`} dir="auto">{display(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>}
        {filtered.length > limit && (
          <div className="p-4 text-center">
            <button type="button" onClick={() => setLimit((l) => l + PAGE_SIZE)} className="min-h-11 rounded-xl bg-muted px-5 text-sm font-bold">
              عرض المزيد ({filtered.length - limit})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
