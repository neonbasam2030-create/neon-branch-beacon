import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, UploadCloud } from "lucide-react";

export const Route = createFileRoute("/app/upload")({
  head: () => ({
    meta: [
      { title: "رفع ملف الإكسل — ZERO" },
      { name: "description", content: "رفع ملفات الإكسل إلى نظام ZERO لحسابات الوكلاء." },
      { property: "og:title", content: "رفع ملف الإكسل — ZERO" },
      { property: "og:description", content: "رفع ملفات الإكسل إلى نظام ZERO لحسابات الوكلاء." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="flex items-center gap-3 font-display text-3xl"><FileSpreadsheet className="size-8 text-neon" /> رفع ملف الإكسل</h1>
      <p className="mt-2 text-muted-foreground">هنا ستتمكن من رفع ملفات الإكسل وحفظها في النظام.</p>
      <div className="glass neon-box mt-8 grid place-items-center rounded-2xl border-2 border-dashed border-neon/40 p-12 text-center">
        <UploadCloud className="float size-14 text-neon" />
        <p className="mt-4 font-bold">منطقة رفع الملفات</p>
        <p className="mt-1 text-sm text-muted-foreground">سيتم تفعيل الرفع والحفظ في المرحلة القادمة.</p>
      </div>
    </div>
  );
}
