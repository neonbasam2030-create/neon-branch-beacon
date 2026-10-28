import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileSpreadsheet, FileText, Trash2, UploadCloud, X } from "lucide-react";
import { formatSize, useFiles, type UploadedFile } from "@/components/dashboard/files-context";

export const Route = createFileRoute("/dashboard/uploads")({
  head: () => ({ meta: [{ title: "رفع الملفات — ZERO" }] }),
  component: UploadsPage,
});

function UploadsPage() {
  const { files, addFiles, removeFile } = useFiles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<UploadedFile | null>(null);

  const handle = (list: FileList | null) => {
    if (!list?.length) return;
    const { added, rejected } = addFiles(list);
    setMessage(
      [added ? `تم رفع ${added} ملف.` : "", rejected.length ? `تم تجاهل: ${rejected.join("، ")} (النوع غير مدعوم أو الحجم أكبر من 20MB).` : ""]
        .filter(Boolean)
        .join(" "),
    );
  };

  return (
    <div className="rise mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold md:text-3xl">رفع الملفات</h1>
      <p className="mt-1 text-sm text-muted-foreground">يدعم ملفات Excel (xlsx, xls, csv) وPDF بحد أقصى 20MB للملف.</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
        className={`mt-6 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-neon bg-muted" : "border-border hover:border-neon"}`}
      >
        <UploadCloud className="size-10 text-neon" aria-hidden />
        <span className="font-bold">اضغط لاختيار الملفات</span>
        <span className="text-sm text-muted-foreground">أو اسحبها وأفلتها هنا</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.pdf,application/pdf"
        className="sr-only"
        onChange={(e) => { handle(e.target.files); e.target.value = ""; }}
      />
      {message && <p role="status" className="mt-3 text-sm text-neon-2">{message}</p>}

      <section className="mt-8" aria-labelledby="files-heading">
        <h2 id="files-heading" className="text-lg font-bold">الملفات المرفوعة ({files.length})</h2>
        {files.length === 0 ? (
          <p className="glass mt-3 rounded-2xl p-6 text-center text-sm text-muted-foreground">لا توجد ملفات بعد.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {files.map((f) => {
              const Icon = f.kind === "pdf" ? FileText : FileSpreadsheet;
              return (
                <li key={f.id} className="glass flex items-center gap-3 rounded-xl p-3">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-lg bg-muted ${f.kind === "pdf" ? "text-neon-2" : "text-neon-3"}`}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <button type="button" onClick={() => setPreview(f)} className="min-h-11 min-w-0 flex-1 text-right">
                    <span className="block truncate text-sm font-bold" dir="auto">{f.name}</span>
                    <span className="block text-xs text-muted-foreground">{f.kind === "pdf" ? "PDF" : "Excel"} · {formatSize(f.size)}</span>
                  </button>
                  <button type="button" onClick={() => removeFile(f.id)} aria-label={`حذف ${f.name}`} className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground transition hover:text-destructive">
                    <Trash2 className="size-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {preview && <PreviewDialog file={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function PreviewDialog({ file, onClose }: { file: UploadedFile; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={file.name} className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="truncate text-sm font-bold" dir="auto">{file.name}</p>
        <button type="button" onClick={onClose} aria-label="إغلاق المعاينة" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-muted">
          <X className="size-5" />
        </button>
      </div>
      {file.kind === "pdf" ? (
        <iframe src={file.url} title={file.name} className="w-full flex-1 bg-white" />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <FileSpreadsheet className="size-14 text-neon-3" aria-hidden />
          <p className="text-sm text-muted-foreground">{formatSize(file.size)} · تم الرفع {file.uploadedAt.toLocaleTimeString("ar")}</p>
          <a href={file.url} download={file.name} className="flex min-h-11 items-center rounded-xl bg-primary px-5 font-bold text-primary-foreground">تنزيل الملف</a>
        </div>
      )}
    </div>
  );
}
