import { ArrowUpRight } from "lucide-react";
import { portfolioSections } from "@/data/portfolio";

export function HeroPortfolio() {
  return (
    <section className="relative isolate overflow-x-clip bg-ember px-4 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-32 lg:px-14">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.76fr)] lg:items-stretch">
        <div className="min-w-0">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-primary">Графика · анимации · AI · 3D</p>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(8rem,0.24fr)] md:items-center">
            <h1 className="max-w-5xl text-left font-heading text-[clamp(2.2rem,9.5vw,3rem)] sm:text-[clamp(3rem,4vw,5rem)] font-semibold leading-[0.94] tracking-[-0.055em] [overflow-wrap:anywhere]">
              Визуальные решения, которые цепляют
            </h1>
          </div>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Собираю айдентику, презентации, сайты, афиши, мерч, 3D-рендеры и анимации для меппинга.
          </p>

          <nav className="mt-9 grid grid-cols-1 gap-2" aria-label="Навигация по кейсам">
  {portfolioSections.map((item) => (
    <a
      key={item.id}
      href={`#${item.id}`}
      className="group flex min-h-12 items-center justify-between gap-4 rounded-md border border-border/60 px-4 py-2.5 text-left transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 focus-visible:bg-primary/10"
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="shrink-0 font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          VIS {item.number}
        </span>
        <span className="truncate text-sm text-foreground/86">
          {item.title}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
    </a>
  ))}
  </nav>
        </div>

        <aside className="relative lg:pb-2" aria-label="Фото автора">
          <div className="absolute -inset-4 rounded-[2rem] border border-primary/20 opacity-70 shadow-glow" aria-hidden />
          <figure className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
            <img
              src={import.meta.env.BASE_URL + "img/site-me.webp"}
              alt="Портрет дизайнера визуальных решений в студии"
              className="aspect-[3/4] w-full object-cover"
              width={900}
              height={1200}
            />
            <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border bg-background/72 p-4 backdrop-blur-xl">
              <p className="text-sm leading-relaxed text-muted-foreground">Сочетаю графику, motion, AI и код для решения задач.</p>
            </figcaption>
          </figure>
        </aside>
      </div>
    </section>
  );
}
