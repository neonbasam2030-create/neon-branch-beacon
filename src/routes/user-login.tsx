import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/components/login-page";

export const Route = createFileRoute("/user-login")({
  head: () => ({
    meta: [
      { title: "دخول المستخدم — ZERO" },
      { name: "description", content: "صفحة دخول المستخدمين المصرح لهم إلى منصة ZERO لتحليلات البيانات." },
      { property: "og:title", content: "دخول المستخدم — ZERO" },
      { property: "og:description", content: "صفحة دخول المستخدمين المصرح لهم إلى منصة ZERO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <LoginPage title="دخول المستخدم" />,
});
