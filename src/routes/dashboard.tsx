import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "لوحة التحكم | نظام أرشيف البلدية" }],
  }),
});

function DashboardPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-secondary/30">
      <Navbar />
      <Dashboard />
    </div>
  );
}
