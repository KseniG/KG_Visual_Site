/*
  Общие помощники вау-блоков «Мастера» (src/components/wow/lib.ts в проекте, импорт — "./lib"; без JSX — сервер копирует помощники *.ts).
  - WowPhoto, WowLink — формы пропсов: фото { src, alt }, кнопка или ссылка { label, href }.
  - Photo — фото в рамке с мягким градиентом, пока картинка грузится; размер задаёт рамка, вёрстка не прыгает.
  - FitText — надпись в одну строку, подогнанная по ширине (длинное слово уменьшается, короткое растёт до maxPx).
  - useCalm — пользователь просил «меньше движения» (prefers-reduced-motion); блоки тогда не двигаются.
  - useBot — страницу снимает робот (снимки для поисковиков, витрина): показываем итоговый вид без анимации.
  - useFineHover — мышь с наведением (на телефоне наведения нет).
  - useStickyOk — залипание (position: sticky) на этой странице работает; нет — блок показывается спокойным.
*/
import { createElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type WowPhoto = { src: string; alt: string };
export type WowLink = { label: string; href: string };

export function useCalm(): boolean {
  return useReducedMotion() ?? false;
}

export function useBot(): boolean {
  const [bot, setBot] = useState(false);
  useEffect(() => setBot(typeof navigator !== "undefined" && navigator.webdriver === true), []);
  return bot;
}

export function useFineHover(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return fine;
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const flat = (v: string) => v === "visible" || v === "clip";

/**
 * Предок, из-за которого position: sticky внутри блока не держится, или null. Overflow hidden, auto или scroll у предка
 * делает его прокручиваемым, и залипание считается от него, а не от окна (overflow-x-hidden тоже: overflow-y тогда auto).
 * overflow-x-clip режет так же, но залипанию не мешает. Overflow у html и у body при html без overflow браузер
 * переносит на окно — они не мешают.
 */
export function stickyBlocker(el: HTMLElement): HTMLElement | null {
  const root = document.documentElement;
  const rs = getComputedStyle(root);
  const bodyToWindow = rs.overflowX === "visible" && rs.overflowY === "visible";
  for (let p: HTMLElement | null = el; p && p !== root; p = p.parentElement) {
    if (p === document.body && bodyToWindow) continue;
    const cs = getComputedStyle(p);
    if (cs.display !== "contents" && !(flat(cs.overflowX) && flat(cs.overflowY))) return p;
  }
  return null;
}

/**
 * Работает ли залипание для блока (ref — корень блока): страница в обёртке с overflow-hidden ломает эффекты прокрутки —
 * заголовок и фото уезжают, ниже пустой экран (дебаг 24.10.2026, «Анонка»). false — показываем спокойный вид, как при
 * «меньше движения», без пустого пути прокрутки; корень блока получает data-wow-sticky="off" — его видит проверка Лепки.
 */
export function useStickyOk(ref: RefObject<HTMLElement | null>): boolean {
  const [ok, setOk] = useState(true);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || !stickyBlocker(el)) return;
    el.setAttribute("data-wow-sticky", "off");
    setOk(false);
  }, []);
  return ok;
}

/** Внешняя ссылка (http…) открывается в новой вкладке; tel:, mailto: и якоря — как есть. */
export function linkProps(href: string): { href: string; target?: string; rel?: string } {
  return /^https?:\/\//.test(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
}

/** Видимый фокус для ссылок и кнопок блоков. */
export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type PhotoProps = {
  photo: WowPhoto;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** украшение: копия фото, уже подписанного в блоке, — без alt для экранного диктора */
  decorative?: boolean;
  sizes?: string;
  style?: CSSProperties;
};

/** Фото, растянутое на рамку (рамке нужен размер: aspect-*, h-* или absolute inset-0). */
export function Photo({ photo, className, imgClassName, priority, decorative, sizes, style }: PhotoProps) {
  return createElement(
    "div",
    { className: cn("relative overflow-hidden bg-gradient-to-br from-muted via-secondary to-accent/40", className), style },
    createElement("img", {
      src: photo.src,
      alt: decorative ? "" : photo.alt,
      "aria-hidden": decorative || undefined,
      sizes,
      decoding: "async",
      loading: priority ? "eager" : "lazy",
      fetchPriority: priority ? "high" : "auto",
      className: cn("absolute inset-0 h-full w-full object-cover", imgClassName),
    }),
  );
}

type FitTextProps = {
  children: string;
  as?: "h1" | "h2" | "p" | "span" | "div";
  className?: string;
  /** предел размера, px: короткое слово не раздувается до размера дома */
  maxPx?: number;
  /** доля ширины рамки: 1 — ровно по ширине, 1.04 — с вылетом за край (рамке нужен overflow-hidden) */
  fill?: number;
  id?: string;
};

/**
 * Надпись в одну строку по ширине рамки. До подгонки размер оценивается по числу букв (cqw), поэтому
 * и в сохранённом HTML надпись не вылезает за экран; после загрузки шрифта размер уточняется по замеру.
 */
export function FitText({ children, as = "div", className, maxPx = 480, fill = 1, id }: FitTextProps) {
  const box = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useIsoLayoutEffect(() => {
    const b = box.current;
    const t = text.current;
    if (!b || !t) return;
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = b.clientWidth * fill;
        const cur = parseFloat(getComputedStyle(t).fontSize);
        const w = t.getBoundingClientRect().width;
        if (!width || !w || !cur) return;
        setSize(Math.min(maxPx, Math.floor(cur * (width / w) * 0.995 * 100) / 100));
      });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(b);
    document.fonts?.ready.then(fit).catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [children, maxPx, fill]);

  const guess = `min(${maxPx}px, calc(${(100 * fill).toFixed(1)}cqw / ${Math.max(1, children.length) * 0.82}))`;
  return createElement(
    as,
    { id, className: cn("block w-full whitespace-nowrap leading-[0.86]", className), style: { containerType: "inline-size" } as CSSProperties },
    createElement(
      "span",
      { ref: box, className: "block w-full" },
      createElement("span", { ref: text, className: "inline-block", style: { fontSize: size ? `${size}px` : guess } }, children),
    ),
  );
}

/** Рамка для fitWord: размеры шрифта внутри считаются от её ширины (cqw). */
export const fitBox = { containerType: "inline-size" } as CSSProperties;

/**
 * Размер заголовка, при котором самое длинное слово влезает в строку целиком: «Стоматологическая» на 390 px
 * не рвётся посередине. Возвращает пропсы для элемента: {...fitWord(title, "clamp(…)")}.
 * Сначала размер оценивается по числу букв (base — обычный размер, share — доля ширины рамки fitBox, k — ширина буквы
 * в em), потом в браузере, когда загрузится шрифт, слово меряется настоящим шрифтом и заголовок при нужде уменьшается
 * (широкие шрифты вроде Unbounded). line — вся строка целиком, без переносов (телефон).
 */
export function fitWord(text: string, base: string, share = 1, k = 0.64, line = false) {
  const plain = text.replace(/[*«»"]/g, "");
  const longest = line ? plain.length : Math.max(1, ...plain.split(/\s+/).map((w) => w.length));
  const style: CSSProperties = { fontSize: `min(${base}, calc(${(100 * share).toFixed(0)}cqw / ${(longest * k).toFixed(2)}))` };
  if (typeof window !== "undefined") watchFit();
  return { style, "data-fit": line ? "line" : "word", "data-fit-max": line ? base : undefined };
}

// ---- уточнение размера по замеру: один наблюдатель на страницу ----
let watching = false;
let queued = false;
let canvas: CanvasRenderingContext2D | null = null;

function fitOne(el: HTMLElement) {
  if (!el.clientWidth) return; // скрыт (например, вариант для другого экрана)
  if (el.dataset.fitBase === undefined) el.dataset.fitBase = el.style.fontSize;
  if (el.dataset.fit === "line") {
    // строка без переносов: от обычного размера (base) уменьшаем ровно по ширине — и крупнее оценки по буквам
    if (el.dataset.fitMax) el.style.fontSize = el.dataset.fitMax;
    const over = el.scrollWidth / el.clientWidth;
    if (over > 1.001) el.style.fontSize = `${Math.floor((parseFloat(getComputedStyle(el).fontSize) / over) * 0.99 * 100) / 100}px`;
    return;
  }
  measure(el, el.clientWidth);
}

function measure(el: HTMLElement, avail: number) {
  const cs = getComputedStyle(el);
  const cur = parseFloat(cs.fontSize);
  canvas ??= document.createElement("canvas").getContext("2d");
  if (!canvas || !cur) return;
  canvas.font = `${cs.fontStyle} ${cs.fontWeight} ${cur}px ${cs.fontFamily}`;
  const ls = parseFloat(cs.letterSpacing) || 0;
  let text = el.textContent ?? "";
  if (cs.textTransform === "uppercase") text = text.toUpperCase();
  const parts = el.dataset.fit === "line" ? [text.trim()] : text.split(/\s+/).filter(Boolean);
  // курсив акцентных слов чуть шире — запас 3 %
  const widest = Math.max(0, ...parts.map((w) => (canvas as CanvasRenderingContext2D).measureText(w).width + ls * w.length)) * 1.03;
  if (widest <= avail) return;
  // ширина заголовка в ch сжимается вместе со шрифтом — слово длиннее рамки в неё не влезет: снимаем предел
  const parent = el.parentElement?.clientWidth ?? avail;
  if (cs.maxWidth !== "none" && parent > avail) {
    el.style.maxWidth = "none";
    measure(el, el.clientWidth);
    return;
  }
  el.style.fontSize = `${Math.floor(((cur * avail) / widest) * 100) / 100}px`;
}

function fitAll(reset = false) {
  queued = false;
  document.querySelectorAll<HTMLElement>("[data-fit]").forEach((el) => {
    if (reset && el.dataset.fitBase !== undefined) {
      el.style.fontSize = el.dataset.fitBase;
      el.style.maxWidth = "";
    }
    fitOne(el);
  });
}

function watchFit() {
  if (watching) return;
  watching = true;
  const later = (reset = false) => {
    if (queued && !reset) return;
    queued = true;
    requestAnimationFrame(() => fitAll(reset));
  };
  later();
  document.fonts?.ready.then(() => later(true)).catch(() => undefined);
  // шрифт заголовков грузится, когда он впервые нужен, — уже после ready: меряем заново
  document.fonts?.addEventListener?.("loadingdone", () => later(true));
  window.addEventListener("resize", () => later(true));
  new MutationObserver(() => later()).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["hidden"],
  });
}

/** Слово в тексте, выделенное *звёздочками*, — акцент (курсив и цвет); остальное — как есть. */
export function accentWords(text: string, accent = "italic text-primary"): ReactNode[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) => (part.startsWith("*") && part.endsWith("*") ? createElement("em", { key: i, className: accent }, part.slice(1, -1)) : part));
}
