/*
  HeroUnfold — первый экран «Раскрытие».
  Сначала крупный заголовок и под ним фото в небольшой рамке. При прокрутке фото разворачивается на весь экран и
  накрывает заголовок, заголовок уезжает вверх и гаснет. Ниже — короткий текст и кнопки. На телефоне путь прокрутки
  короткий (около половины экрана), при «меньше движения» — заголовок и фото в большой рамке без эффекта. Эффект держится
  на position: sticky: страницу не оборачивать в overflow-hidden / overflow-x-hidden (от прокрутки вбок —
  overflow-x-clip), иначе блок показывается без эффекта.
  Когда уместен: у бизнеса есть одно сильное широкое фото места или результата — отель, ресторан, студия, клиника,
  салон, загородный дом. Хорош, когда фото само по себе «продаёт».
  Нужно фото: 1 (горизонтальное, высокого качества: на весь экран).
  Пример:
    import { HeroUnfold } from "@/components/wow/HeroUnfold";
    <HeroUnfold
      title="Дом у озера для *тихих* выходных"
      kicker="Гостевой дом «Берег» · Карелия"
      text="Шесть домиков у воды, баня на дровах и завтраки из местных продуктов."
      photo={{ src: "/images/hero.webp", alt: "Домики у озера на закате" }}
      actions={[{ label: "Выбрать даты", href: "#booking" }, { label: "Домики", href: "#houses" }]}
    />
*/
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Photo, accentWords, fitBox, fitWord, focusRing, linkProps, useBot, useCalm, useStickyOk, type WowLink, type WowPhoto } from "./lib";

export type HeroUnfoldProps = {
  title: string;
  kicker?: string;
  text?: string;
  photo: WowPhoto;
  actions?: WowLink[];
  className?: string;
};

function Heading({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mx-auto max-w-[1100px] text-center" style={fitBox}>
      {kicker && <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground md:text-sm">{kicker}</p>}
      <h1 className="font-heading leading-[0.95] tracking-tight [overflow-wrap:anywhere] [text-wrap:balance]" {...fitWord(title, "clamp(2.5rem,7vw,7rem)")}>
        {accentWords(title)}
      </h1>
    </div>
  );
}

export function HeroUnfold({ title, kicker, text, photo, actions = [], className }: HeroUnfoldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const calm = useCalm();
  const bot = useBot();
  // обёртка страницы с overflow-hidden — фото не раскрылось бы, а ниже был бы пустой экран
  const sticky = useStickyOk(root);
  const still = calm || bot || !sticky;
  // на телефоне рамка в начале крупнее: экран узкий
  const [phone, setPhone] = useState(false);
  useEffect(() => setPhone(window.innerWidth < 768), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 0.85], [phone ? 0.6 : 0.46, 1]);
  const y = useTransform(scrollYProgress, [0, 0.85], [phone ? "16%" : "13%", "0%"]);
  const headY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-45%"]);
  // заголовок гаснет, пока фото его накрывает: фото, обрезающее строку заголовка, смотрелось криво (Дима, 24.10.2026).
  // Диапазон — от 0 до 1 целиком: прозрачность от прокрутки framer-motion 13.4 отдаёт браузеру (анимация с ScrollTimeline),
  // и без крайних точек после 0,36 заголовок проявлялся снова (на сайте «Анонки» — до 0,9 к концу прокрутки)
  const headO = useTransform(scrollYProgress, [0, 0.08, 0.36, 1], [1, 1, 0, 0]);

  const after = (text || actions.length > 0) && (
    <div className="mx-auto flex max-w-[1100px] flex-col items-start gap-6 px-4 py-12 sm:px-8 md:flex-row md:items-end md:justify-between md:py-16 lg:px-0">
      {text && <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">{text}</p>}
      {actions.length > 0 && (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {actions.slice(0, 2).map((a, i) => (
            <a
              key={a.href + i}
              {...linkProps(a.href)}
              className={cn(
                "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-base font-medium transition-transform duration-300 hover:-translate-y-0.5",
                focusRing,
                i === 0 ? "bg-primary text-primary-foreground" : "border border-border",
              )}
            >
              {a.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  if (still) {
    return (
      <section ref={root} data-wow-sticky="" className={cn("bg-background pt-24 text-foreground md:pt-28", className)}>
        <div className="px-4 sm:px-8 lg:px-14">
          <Heading title={title} kicker={kicker} />
          <Photo photo={photo} priority sizes="100vw" className="mx-auto mt-10 aspect-[4/5] w-full max-w-[1300px] rounded-[var(--radius)] sm:aspect-[16/9]" />
        </div>
        {after}
      </section>
    );
  }

  return (
    <section ref={root} data-wow-sticky="" className={cn("bg-background text-foreground", className)}>
      {/* путь прокрутки: на телефоне короткий, на компьютере — полтора экрана */}
      <div ref={ref} className="relative h-[155svh] md:h-[230svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div className="absolute inset-x-0 top-0 px-4 pt-24 sm:px-8 md:pt-28 lg:px-14" style={{ y: headY, opacity: headO }}>
            <Heading title={title} kicker={kicker} />
          </motion.div>
          <motion.div className="absolute inset-0 overflow-hidden rounded-[1.25rem] will-change-transform" style={{ scale, y }}>
            <Photo photo={photo} priority sizes="100vw" className="absolute inset-0" />
          </motion.div>
        </div>
      </div>
      {after}
    </section>
  );
}
