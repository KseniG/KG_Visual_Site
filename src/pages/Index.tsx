import { Header } from "@/components/landing/Header";
import { HeroPortfolio } from "@/components/landing/HeroPortfolio";
import { MobileWelcome } from "@/components/landing/MobileWelcome";
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
      <MobileWelcome />
    </div>
  );
}
