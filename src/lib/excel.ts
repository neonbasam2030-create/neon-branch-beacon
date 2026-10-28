import { read, utils } from "xlsx";

export type CellValue = string | number;

export type ColumnRole = "name" | "receipt" | "paid" | "remaining" | "agent" | "status" | "job" | "date" | "notes";

export type Sheet = {
  name: string;
  headers: string[];
  rows: CellValue[][];
  roles: Partial<Record<ColumnRole, number>>;
};

const ROLE_ALIASES: Record<ColumnRole, string[]> = {
  name: ["اسمالجواز", "الاسم", "اسمصاحبالجواز", "اسمالعميل"],
  receipt: ["رقمالسند", "السند"],
  paid: ["الواصل", "المدفوع", "الواصلمنه"],
  remaining: ["المتبقي", "الباقي", "المتبقيعليه"],
  agent: ["الوكيل", "اسمالوكيل"],
  status: ["حالهالجواز", "الحاله", "حالهالطلب"],
  job: ["المهنه"],
  date: ["التاريخ"],
  notes: ["ملاحظات", "الملاحظات"],
};

export function normalizeArabic(text: string) {
  return text
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "")
    .trim();
}

function toAsciiDigits(text: string) {
  return text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function toNumber(value: CellValue | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const n = Number(toAsciiDigits(value).replace(/[,،\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatCell(value: unknown): CellValue {
  if (value instanceof Date) {
    return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`;
  }
  if (typeof value === "number") return value;
  if (value == null) return "";
  return String(value).trim();
}

function detectRoles(headers: string[]) {
  const roles: Partial<Record<ColumnRole, number>> = {};
  const normalized = headers.map(normalizeArabic);
  for (const [role, aliases] of Object.entries(ROLE_ALIASES) as [ColumnRole, string[]][]) {
    const index = normalized.findIndex((h) => aliases.includes(h));
    if (index !== -1) roles[role] = index;
  }
  return roles;
}

export async function parseExcel(file: File): Promise<Sheet[]> {
  const workbook = read(await file.arrayBuffer(), { cellDates: true, dense: true });
  const sheets: Sheet[] = [];

  for (const sheetName of workbook.SheetNames) {
    const raw = utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, defval: "", blankrows: false });
    const grid = raw.map((row) => row.map(formatCell));
    const headerIndex = grid.findIndex((row) => row.filter((c) => c !== "").length >= 2);
    if (headerIndex === -1) continue;

    const width = Math.max(...grid.map((r) => r.length));
    const headers = Array.from({ length: width }, (_, i) => String(grid[headerIndex][i] ?? "") || `عمود ${i + 1}`);
    const rows = grid
      .slice(headerIndex + 1)
      .map((r) => Array.from({ length: width }, (_, i) => r[i] ?? ""))
      .filter((r) => r.some((c) => c !== ""));

    const usedColumns = headers.map((h, i) => !h.startsWith("عمود ") || rows.some((r) => r[i] !== ""));
    const keep = usedColumns.map((used, i) => (used ? i : -1)).filter((i) => i !== -1);
    const finalHeaders = keep.map((i) => headers[i]);

    sheets.push({
      name: sheetName,
      headers: finalHeaders,
      rows: rows.map((r) => keep.map((i) => r[i])),
      roles: detectRoles(finalHeaders),
    });
  }

  return sheets;
}
