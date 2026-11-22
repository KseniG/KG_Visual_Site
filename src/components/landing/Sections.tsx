import { ArrowRight, Sparkles, Boxes, WandSparkles } from "lucide-react";
import { Filmstrip } from "@/components/wow/Filmstrip";
import { portfolioSections, filmPhotos } from "@/data/portfolio";
import { CaseBlock } from "./CaseBlock";

export function AboutSection() {
  const skills = [
    { href: "#branding", icon: Sparkles, title: "Графика", text: "Айдентика, афиши, вёрстка, презентации и сайты." },
    { href: "#mapping-new-year", icon: Boxes, title: "3D", text: "Рендеры, предметные сцены, упаковка, композиции для промо и презентаций." },
    { href: "#motion", icon: WandSparkles, title: "AI + motion", text: "Генеративные кадры, анимационные фрагменты, визуалы для экранов и меппинга." },
  ];

  return (
    <section id="about" className="border-y border-border bg-background px-4 py-20 sm:px-8 md:py-28 lg:px-14">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <h2 className="text-3xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-5xl">Меня зовут Ксения, я специалист в сфере дизайна и IT</h2>
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Работаю на стыке графического дизайна, движения, 3D и AI. Люблю, когда визуал не украшает проект, а запоминается и становится чем-то значимым.</p>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-[1320px] gap-4 md:grid-cols-3">
        {skills.map((item) => (
          <a href={item.href} key={item.title} className="rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
            <item.icon className="mb-8 size-9 text-primary" aria-hidden />
            <h3 className="text-2xl font-semibold uppercase tracking-tight">{item.title}</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{item.text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function CasesSection() {
  const stats = [
    { value: "4 года", text: "в дизайне и программировании. Учусь и работаю инженером в РГПУ им. Герцена. Делала меппинг с командой Experiment 619." },
    { value: "10", text: "инструментов для графики, 3D и анимации.", tools: "Figma, Illustrator, CorelDRAW, Photoshop, Krita, Blender, Cinema 4D, After Effects, Gemini и Kling." },
    { value: "15", text: "кейсов — от афиш и плакатов до сайта продакшена Cinestatic и презентации для участников ПМЭФ." },
  ];

  return (
    <section id="cases" className="px-4 py-20 sm:px-8 md:py-28 lg:px-14 [&>div>article:last-child]:pb-0">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 md:mb-14">
          <h2 className="text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.05em] md:text-7xl">Кейсы</h2>
          <dl className="mt-10 grid grid-cols-1 gap-[clamp(2rem,5vw,6rem)] md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.value} className="flex min-w-0 flex-col gap-3 text-left">
                <dt className="font-heading text-5xl font-semibold leading-none tracking-[-0.05em] text-primary md:text-6xl">{item.value}</dt>
                <dd className="text-base leading-snug text-muted-foreground">
                  {item.text}
                  {item.tools && (
                    <details className="group mt-2">
                      <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-sm text-primary underline underline-offset-4 [&::-webkit-details-marker]:hidden">
                        <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-primary group-open:rotate-90 motion-safe:transition-transform" />
                        Список инструментов
                      </summary>
                      <p className="mt-2">{item.tools}</p>
                    </details>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {portfolioSections.map((section) => (
          <CaseBlock key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    ["01", "Ищу эмоцию", "Что должно запомниться: форма, движение, свет, характер шрифта или фактура."],
    ["02", "Собираю систему", "Сетка, контраст, носители и правила, чтобы каждый материал говорил на одном языке."],
    ["03", "Воплощаю идею", "Довожу замысел до носителя: печати, сайта, рендера, объекта или проекции, чтобы работа существовала не только на экране."],
  ];

  return (
    <section id="process" className="border-y border-border bg-ember px-4 py-20 sm:px-8 md:py-28 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-4 md:grid-cols-3">
          <h2 className="pl-[4px] col-span-full mb-10 text-left text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">Креативный подход — системное мышление.</h2>
          {steps.map(([num, title, text]) => (
            <div key={num} className="rounded-3xl border border-border bg-background/58 p-7 backdrop-blur">
              <p className="mb-10 font-heading text-6xl font-semibold text-primary/80">{num}</p>
              <h3 className="text-2xl font-semibold uppercase tracking-tight">{title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ShowsSection() {
  const projects = [
    {
      date: "17.12.2025",
      title: "Рождественский вечер",
      text: "Оформление мероприятия для студентов РГПУ",
      action: "Открыть пост",
      href: "https://t.me/KG_Vislab/17",
      disabled: false,
    },
    {
      date: "03.11.2026",
      title: "День народного единства",
      text: "Оформление анимационной заставки на университетском мероприятии",
      action: "Открыть пост",
      href: "https://t.me/KG_Vislab/49",
      disabled: false,
    },
    {
      date: "14.10.2026",
      title: "Великий Устюг",
      text: "Съёмка и оформление интервью про конкурсный проект",
      action: "Скоро",
      href: "#contacts",
      disabled: true,
    },
  ];

  return (
    <section className="bg-background px-4 py-20 text-foreground sm:px-8 md:py-28 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <h2 className="mb-10 text-5xl font-semibold leading-[0.92] tracking-[-0.05em] md:mb-14 md:text-7xl">Показы на мероприятиях</h2>
        <div className="border-y border-border">
          {projects.map((project) => (
            <article key={project.title} className="grid gap-5 border-b border-border py-7 last:border-b-0 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center md:gap-8 md:py-9">
              <p className="font-heading text-2xl font-semibold tracking-[-0.03em] text-primary md:text-3xl">{project.date}</p>
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold uppercase leading-tight tracking-[-0.03em] md:text-4xl">{project.title}</h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{project.text}</p>
              </div>
              {project.disabled ? (
                <span className="inline-flex min-h-11 w-fit items-center rounded-full border border-border bg-muted px-6 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground" aria-disabled="true">
                  {project.action}
                </span>
              ) : (
                <a href={project.href} className="inline-flex min-h-11 w-fit items-center rounded-full bg-primary px-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow">
                  {project.action}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FilmSection() {
  return <Filmstrip title="Кадры работ" photos={filmPhotos} />;
}

export { ProjectFooter as Footer } from "./ProjectFooter";
