import { useLayoutEffect } from "react";
import { Header } from "@/components/landing/Header";
import { HeroPortfolio } from "@/components/landing/HeroPortfolio";
import {
  AboutSection,
  CasesSection,
  ProcessSection,
  ShowsSection,
  FilmSection,
  Footer,
} from "@/components/landing/Sections";

// Локальная сборка из доступных блоков. Исходный Index.tsx отсутствовал.
export default function Index() {
  useLayoutEffect(() => {
    const sectionId = window.location.hash.slice(1);
    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, []);
  return (
    <div id="top">
      <Header />
      <main>
        <HeroPortfolio />
        <AboutSection />
        <CasesSection />
        <ProcessSection />
        <ShowsSection />
        <FilmSection />
      </main>
      <Footer />
    </div>
  );
}
