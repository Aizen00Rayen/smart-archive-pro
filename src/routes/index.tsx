import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Impact } from "@/components/landing/Impact";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "نظام ذكي لأرشفة وثائق البلدية | Smart Municipal Archive" },
      { name: "description", content: "نظام متكامل للرقمنة، التصنيف الآلي، والبحث الذكي في وثائق البلديات الجزائرية." },
    ],
  }),
});

function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Impact />
      </main>
      <Footer />
    </div>
  );
}
