import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PortfolioSection } from "@/data/portfolio";

type Props = { section: PortfolioSection };
const reveal = {
  hidden: { opacity: 0, x: -5, y: -5 },
  show: { opacity: 1, x: 0, y: 0 },
};
export function CaseBlock({ section }: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const calm = useReducedMotion();
  useEffect(() => {
    const reset = () => {
      setActive(0);
      lock.current = false;
      setBusy(false);
      clearTimeout(timer.current);
    };
    const hash = () => {
      if (location.hash === `#${section.id}`) reset();
    };
    const click = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest?.(`a[href="#${section.id}"]`)) reset();
    };
    window.addEventListener("hashchange", hash);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("hashchange", hash);
      document.removeEventListener("click", click);
      clearTimeout(timer.current);
    };
  }, [section.id]);
  if (!section.cases.length) return null;
  const index = active % section.cases.length;
  const item = section.cases[index];
  const move = (step: number) => {
    if (lock.current || section.cases.length < 2) return;
    lock.current = true;
    setBusy(true);
    setDirection(step);
    setActive((current) => (current + step + section.cases.length) % section.cases.length);
    timer.current = setTimeout(() => {
      lock.current = false;
      setBusy(false);
    }, calm ? 100 : 650);
  };
  return (
    <article id={section.id} className="scroll-mt-24 border-t border-border py-12 md:py-20">
      <div className="relative lg:px-14">
        <div className="case-grid grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="case-text-shell min-w-0 overflow-hidden rounded-3xl border border-border bg-card-ember p-6 pb-5 md:p-8 md:pb-5">
            <div className="mb-5 flex items-center gap-2 whitespace-nowrap text-primary" aria-live="polite">
              <span className="text-sm font-semibold tabular-nums text-primary">
                {String(index + 1).padStart(2, "0")} / {String(section.cases.length).padStart(2, "0")}
              </span>
              <span aria-hidden>·</span>
              <span className="text-sm tracking-[0.06em] sm:tracking-[0.12em]">
                {section.direction}
              </span>
            </div>
            <motion.div
              key={index}
              initial={calm ? false : "hidden"}
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.065 } } }}
              className="flex flex-col gap-4"
            >
              <motion.h4
                variants={reveal}
                className="text-3xl font-semibold leading-[1.08] tracking-tight [overflow-wrap:anywhere] md:text-4xl"
              >
                {item.title}
              </motion.h4>
              {item.role.length > 0 && (
                <motion.ul variants={reveal} className="space-y-1 text-base text-muted-foreground">
                  {item.role.map((role) => <li key={role}><span className="mr-2 text-primary" aria-hidden>↗</span>{role}</li>)}
                </motion.ul>
              )}
              <motion.p variants={reveal} className="text-base leading-snug text-foreground/88">
                {item.shortDescription}
              </motion.p>
              {item.description && <motion.div variants={reveal}>
                <p className="mb-2 text-sm text-muted-foreground">Что сделано</p>
                <p className="text-base leading-snug text-muted-foreground">{item.description}</p>
              </motion.div>}
              {item.deliverables.length > 0 && (
                <motion.div variants={reveal}>
                  <p className="mb-2 text-sm text-muted-foreground">Результат</p>
                  <div className="flex flex-wrap gap-2">
                    {item.deliverables.map((text) => (
                      <span key={text} className="case-result rounded-full px-3 py-1.5 text-sm">
                        {text}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              {item.href && <motion.a variants={reveal} href={item.href} target="_blank" rel="noopener noreferrer" className="w-fit text-base text-primary underline underline-offset-4 hover:text-foreground">Открыть сайт ↗</motion.a>}
              {item.tools.length > 0 && (
                <motion.div variants={reveal}>
                  <p className="mb-2 text-sm text-muted-foreground">Инструменты</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tools.map((text) => (
                      <span key={text} className="rounded-full border border-border bg-muted px-3 py-1.5 text-sm text-foreground">
                        {text}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          <div className="case-visual-shell min-w-0 overflow-hidden rounded-3xl border border-border bg-card">
            <motion.div
              key={index}
              initial={calm ? false : { opacity: 0, x: direction * -70 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: calm ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`case-media-content grid h-full min-h-0 gap-3 p-3 sm:gap-4 sm:p-5 ${item.layout === "pair" ? "grid-cols-2" : "grid-cols-1"}`}

            >
              {item.images.map((image, i) => (
                <div key={i} className={`flex min-h-0 min-w-0 items-center justify-center ${image.fit === "full-height" || item.layout === "full-height" ? "case-media-full-height" : ""}`}>
                  {image.type === "video" ? <video
                    src={image.src}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={image.alt}
                    style={{ aspectRatio: image.aspect || "16 / 9" }}
                    className="max-h-full w-full rounded-2xl object-contain"
                  /> : <img
                    src={image.src}
                    alt={image.alt}
                    style={{ aspectRatio: image.aspect || "4 / 3" }}
                    className="max-h-full w-full rounded-2xl object-cover"
                    loading="lazy"
                  />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        {section.cases.length > 1 && (
          <div className="case-arrows mt-5 flex justify-between">
            {[-1, 1].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => move(step)}
                disabled={busy}
                aria-label={`${step < 0 ? "Предыдущий" : "Следующий"} кейс: ${section.title}`}
                className="case-arrow grid size-11 place-items-center rounded-full border border-border text-primary"
              >
                {step < 0 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
