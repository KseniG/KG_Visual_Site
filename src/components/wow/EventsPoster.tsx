/*
  EventsPoster — раздел «Афиша»: ближайшие события — огромное число даты, месяц и день недели мелко, время,
  название, строка описания, цена или «Вход свободный», кнопка. Прошедшие даты скрываются сами (в браузере посетителя,
  по часовому поясу бизнеса timeZone); прошли все — спокойная строка «Новые даты — скоро» и кнопка из empty.
  На телефоне — список, дата крупно слева.
  Когда уместен: у бизнеса есть мероприятия — живая музыка, квизы, дегустации, мастер-классы, лекции, выставки.
  Даты человек обычно не называет — поставьте правдоподобные ближайшие и перечислите среди того, что нужно заменить.
  Нужно фото: 0.
  Пример:
    import { EventsPoster } from "@/components/wow/EventsPoster";
    <EventsPoster
      title="Афиша"
      events={[
        { date: "2026-11-07", time: "20:00", title: "Джаз-трио «Северный ветер»", text: "Стандарты и босса-нова", price: "500 ₽", action: { label: "Забронировать стол", href: "#booking" } },
        { date: "2026-11-14", time: "19:00", title: "Винная дегустация", text: "6 вин Кубани с сомелье", price: "2 500 ₽" },
        { date: "2026-11-21", time: "19:30", title: "Квиз «Кино 90-х»", free: true },
      ]}
      empty={{ label: "Узнать о новых датах", href: "https://t.me/name" }}
      timeZone="Europe/Moscow"
    />
  date — «ГГГГ-ММ-ДД». free: true — «Вход свободный» на языке сайта.
*/
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fitBox, fitWord, focusRing, linkProps, type WowLink } from "./lib";
import { useT, type Labels } from "./i18n";
import { fmtDate, useNow } from "./time";

type Ev = { date: string; time?: string; title: string; text?: string; price?: string; free?: boolean; action?: WowLink };
export type EventsPosterProps = { title: string; intro?: string; events: Ev[]; empty?: WowLink; timeZone?: string; labels?: Labels; className?: string };

export function EventsPoster({ title, intro, events, empty, timeZone = "Europe/Moscow", labels, className }: EventsPosterProps) {
  const { t, locale } = useT(labels);
  const now = useNow(timeZone);
  // прошедшие скрываем: дата раньше сегодняшней в часовом поясе бизнеса
  const next = events
    .filter((e) => e.date >= now.iso)
    .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")))
    .slice(0, 6);

  return (
    <section className={cn("bg-background px-4 py-20 text-foreground sm:px-8 md:py-28 lg:px-14", className)}>
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-end">
          <div style={fitBox}>
            <h2 className="font-heading leading-[0.95] tracking-tight [overflow-wrap:anywhere]" {...fitWord(title, "clamp(2.5rem,7vw,6.5rem)")}>
              {title}
            </h2>
          </div>
          {intro && <p className="text-lg leading-relaxed text-muted-foreground">{intro}</p>}
        </div>

        {next.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border-y border-border py-10 md:flex-row md:items-center md:justify-between">
            <p className="font-heading text-2xl md:text-3xl">{t("soon")}</p>
            {empty && (
              <a
                {...linkProps(empty.href)}
                className={cn(
                  "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-foreground px-6 text-base font-medium hover:bg-foreground hover:text-background",
                  focusRing,
                )}
              >
                {empty.label}
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            )}
          </div>
        ) : (
          <ol className="border-t-2 border-foreground">
            {next.map((e, i) => (
              <li
                key={i}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-4 border-b border-border py-6 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-center md:gap-x-10 md:py-8"
              >
                <div className="leading-none">
                  <span className="block font-heading text-[clamp(3.25rem,7vw,6.5rem)] leading-[0.85] tracking-tight lining-nums">
                    {fmtDate(e.date, locale, { day: "numeric" })}
                  </span>
                  <span className="mt-2 block text-sm uppercase tracking-[0.12em] text-muted-foreground">
                    {fmtDate(e.date, locale, { month: "short" }).replace(".", "")} · {fmtDate(e.date, locale, { weekday: "short" }).replace(".", "")}
                  </span>
                </div>
                <div className="min-w-0">
                  {e.time && <p className="mb-1 font-mono text-sm text-primary lining-nums">{e.time}</p>}
                  <h3 className="font-heading text-2xl leading-tight [hyphens:auto] [overflow-wrap:anywhere] md:text-4xl">{e.title}</h3>
                  {e.text && <p className="mt-2 text-base leading-snug text-muted-foreground md:text-lg">{e.text}</p>}
                </div>
                <div className="col-start-2 flex flex-wrap items-center gap-4 md:col-start-3 md:flex-col md:items-end md:gap-3">
                  <span className="whitespace-nowrap text-lg font-medium lining-nums">{e.free ? t("free") : e.price}</span>
                  {e.action && (
                    <a
                      {...linkProps(e.action.href)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-5 text-base font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5",
                        focusRing,
                      )}
                    >
                      {e.action.label}
                      <ArrowUpRight aria-hidden className="size-4" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
