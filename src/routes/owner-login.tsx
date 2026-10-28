import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/login-page";

export const Route = createFileRoute("/owner-login")({
  head: () => ({
    meta: [
      { title: "دخول المالك — ZERO" },
      { name: "description", content: "صفحة دخول مالك منصة ZERO لتحليلات البيانات." },
      { property: "og:title", content: "دخول المالك — ZERO" },
      { property: "og:description", content: "صفحة دخول مالك منصة ZERO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LoginPage title="دخول المالك" />,
});
