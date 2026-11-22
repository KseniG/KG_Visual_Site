/*
  Filmstrip — раздел «Плёнка».
  3–6 фото кадрами фотоплёнки: тёмная лента с перфорацией и номерами кадров, на компьютере едет вбок, пока раздел
  проходит через экран. Нажатие на кадр открывает просмотр на весь экран с листанием (стрелки, клавиши, свайп; Esc —
  закрыть). На телефоне ленту листают пальцем.
  Когда уместен: работы, интерьер, атмосфера, события — фотограф, кафе, отель, салон, студия, мастерская, площадка.
  Нужно фото: 3–6 (можно повторить те, что уже есть на сайте; подпись к кадру — по желанию).
  Пример:
    import { Filmstrip } from "@/components/wow/Filmstrip";
    <Filmstrip
      title="Как у нас"
      intro="Зал, кухня и завтраки — без фильтров."
      photos={[
        { src: "/images/hall.webp", alt: "Зал утром", caption: "Зал у окна" },
        { src: "/images/cup.webp", alt: "Капучино" },
        { src: "/images/buns.webp", alt: "Булочки с кардамоном" },
      ]}
    />
*/
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Photo, fitBox, fitWord, focusRing, useBot, useCalm, type WowPhoto } from "./lib";
import { useT, type Labels } from "./i18n";

type Frame = WowPhoto & { caption?: string };
export type FilmstripProps = { title: string; intro?: string; photos: Frame[]; labels?: Labels; className?: string };

// перфорация плёнки — повторяющиеся светлые окошки
const holes = "repeating-linear-gradient(90deg, transparent 0 10px, rgb(255 255 255 / 0.85) 10px 22px, transparent 22px 34px)";

function Viewer({ photos, start, onClose, labels }: { photos: Frame[]; start: number; onClose: () => void; labels?: Labels }) {
  const { t } = useT(labels);
  const [i, setI] = useState(start);
  const close = useRef<HTMLButtonElement>(null);
  const go = (d: number) => setI((v) => (v + d + photos.length) % photos.length);
  useEffect(() => {
    close.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const ph = photos[i];
  const btn = cn("grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25", focusRing);
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={ph.alt}
      className="fixed inset-0 z-[2147483000] flex flex-col bg-black/95 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between p-4 font-mono text-sm text-white/70">
        <span className="lining-nums">
          {String(i + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button ref={close} type="button" onClick={onClose} className={btn} aria-label={t("close")}>
          <X className="size-6" />
        </button>
      </div>
      <motion.div
        className="relative min-h-0 flex-1 px-2 md:px-20"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info: PanInfo) => Math.abs(info.offset.x) > 70 && go(info.offset.x < 0 ? 1 : -1)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={ph.src + i}
            src={ph.src}
            alt={ph.alt}
            className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            draggable={false}
          />
        </AnimatePresence>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={cn(btn, "absolute left-3 top-1/2 hidden -translate-y-1/2 md:grid")}
              aria-label={t("prevFrame")}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(btn, "absolute right-3 top-1/2 hidden -translate-y-1/2 md:grid")}
              aria-label={t("nextFrame")}
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </motion.div>
      <p className="min-h-14 px-4 py-4 text-center text-base text-white/80">{ph.caption ?? ph.alt}</p>
    </motion.div>,
    document.body,
  );
}

export function Filmstrip({ title, intro, photos, labels, className }: FilmstripProps) {
  const { t } = useT(labels);
  const calm = useCalm();
  const bot = useBot();
  const frames = photos.slice(0, 6);
  const [open, setOpen] = useState<number | null>(null);
  const sec = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [desk, setDesk] = useState(false);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const on = () => {
      setDesk(window.innerWidth >= 768);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 32));
    };
    on();
    window.addEventListener("resize", on);
    const ro = new ResizeObserver(on);
    if (track.current) ro.observe(track.current);
    return () => {
      window.removeEventListener("resize", on);
      ro.disconnect();
    };
  }, [frames.length]);
  const { scrollYProgress } = useScroll({ target: sec, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0.1, 0.9], [0, -dist]);
  const ride = desk && !calm && !bot;

  return (
    <section ref={sec} className={cn("overflow-hidden bg-background py-20 text-foreground md:py-28", className)}>
      <div className="mx-auto mb-10 grid max-w-[1400px] gap-4 px-4 sm:px-8 md:mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-end lg:px-14">
        <div style={fitBox}>
          <h2 className="font-heading leading-[0.95] tracking-tight [overflow-wrap:anywhere]" {...fitWord(title, "clamp(2.25rem,5.5vw,5rem)")}>
            {title}
          </h2>
        </div>
        {intro && <p className="text-lg leading-relaxed text-muted-foreground">{intro}</p>}
      </div>

      {/* плёнка: на компьютере едет при прокрутке, на телефоне листается */}
      <div className={cn("bg-neutral-950 py-7 text-white md:py-9", !ride && "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden")}>
        <motion.ul ref={track} className="flex w-max snap-x snap-mandatory gap-3 px-4 sm:px-8 md:gap-4 lg:px-14" style={ride ? { x } : undefined}>
          {frames.map((f, i) => (
            <li key={i} className="relative w-[78vw] max-w-[420px] shrink-0 snap-start md:w-[min(34vw,460px)]">
              <span aria-hidden className="absolute -top-5 left-0 right-0 h-2.5 opacity-80 md:-top-6" style={{ background: holes }} />
              <button
                type="button"
                onClick={() => setOpen(i)}
                className={cn("group block w-full overflow-hidden rounded-[2px]", focusRing, "focus-visible:ring-offset-neutral-950")}
                aria-label={t("openFrame", { x: f.alt })}
              >
                <Photo
                  photo={f}
                  sizes="(min-width: 768px) 34vw, 78vw"
                  className="aspect-[3/2] w-full transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </button>
              <span aria-hidden className="absolute -bottom-5 left-0 right-0 h-2.5 opacity-80 md:-bottom-6" style={{ background: holes }} />
              <span className="mt-1 flex justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                <span className="lining-nums">{String(i + 1).padStart(2, "0")}A</span>
                {f.caption && <span className="truncate text-white/70">{f.caption}</span>}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>

      <AnimatePresence>{open !== null && <Viewer photos={frames} start={open} onClose={() => setOpen(null)} labels={labels} />}</AnimatePresence>
    </section>
  );
}
