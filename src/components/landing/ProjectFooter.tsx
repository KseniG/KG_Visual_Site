import { useState } from "react";

const directions = ["Брендинг и цифровой дизайн", "Мерч", "Графика", "Моушн", "3D-меппинг", "AI"];
export function ProjectFooter() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (name: string) => setSelected((current) => current.includes(name) ? current.filter((value) => value !== name) : [...current, name]);
  const message = selected.length ? `Здравствуйте! Хочу обсудить проект. Интересуют направления: ${selected.join(", ")}.` : "Здравствуйте! Хочу обсудить проект.";
  const contact = `https://t.me/KG_visual?text=${encodeURIComponent(message)}`;
  return (
    <footer id="contacts" className="px-4 py-16 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="project-energy-panel relative rounded-3xl border border-border bg-card p-5 sm:p-8">
            <div className="mb-8 grid grid-cols-2 auto-rows-fr gap-3 lg:gap-4" aria-label="Направления проекта">
              {directions.map((name) => <button key={name} type="button" aria-pressed={selected.includes(name)} onClick={() => toggle(name)} className={`h-12 lg:h-16 min-w-0 rounded-full border bg-background/90 px-3 py-1 text-sm lg:text-base transition-all duration-300 focus-visible:outline-2 focus-visible:outline-ring ${selected.includes(name) ? "border-primary text-primary" : "border-foreground/60 text-foreground hover:border-foreground"}`}>{name}</button>)}
            </div>
            <a href={contact} target="_blank" rel="noopener noreferrer" className="relative mx-auto flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-ring">Обсудить проект ↗</a>
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-border bg-card-ember p-6 sm:p-10">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Есть идея или проект?</h2>
            <p className="mt-6 text-xl leading-relaxed">Давай обсудим, как воплотить его в жизнь.</p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Открыта к интересным задачам, экспериментам и сотрудничеству.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                ["Email", "mailto:ksenigu@mail.ru"],
                ["Telegram", "https://t.me/KG_visual"],
                ["VK", "https://vk.ru/ksenigu"],
                ["Telegram-канал", "https://t.me/KG_Vislab"],
              ].map(([label, href]) => <a key={label} href={href} {...(href.startsWith("https") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">{label}</a>)}
            </div>

          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground text-center md:flex-row md:items-center md:justify-center">
          <p>© 2026 KG Visual</p>
        </div>
      </div>
    </footer>
  );
}
