/*
  Даты и часы вау-блоков (src/components/wow/time.ts, импорт — "./time"). Всё считается в браузере посетителя по
  часовому поясу бизнеса (проп timeZone: Europe/Moscow, Asia/Almaty, Europe/Rome…). Даты — строками «ГГГГ-ММ-ДД».
*/
import { useEffect, useState } from "react";

export type Zoned = { iso: string; wd: number; minutes: number };

/** Сейчас в часовом поясе: дата «ГГГГ-ММ-ДД», день недели (пн = 0) и минуты от полуночи. */
export function zonedNow(tz = "Europe/Moscow", at = new Date()): Zoned {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
  return {
    iso: `${get("year")}-${get("month")}-${get("day")}`,
    wd: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const utc = (iso: string) => new Date(`${iso}T12:00:00Z`);

export function addDays(iso: string, n: number) {
  const d = utc(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** День недели даты (пн = 0). */
export const weekday = (iso: string) => (utc(iso).getUTCDay() + 6) % 7;

// казахские названия — своей таблицей: в части браузеров нет данных kk для Intl («M10 25, Sun»)
const KK = {
  wdShort: ["дс", "сс", "ср", "бс", "жм", "сб", "жс"],
  wdLong: ["дүйсенбі", "сейсенбі", "сәрсенбі", "бейсенбі", "жұма", "сенбі", "жексенбі"],
  mShort: ["қаң.", "ақп.", "нау.", "сәу.", "мам.", "мау.", "шіл.", "там.", "қыр.", "қаз.", "қар.", "жел."],
  mLong: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
};

/** Дата на языке сайта: fmtDate("2026-10-25", "ru-RU", { day: "numeric", month: "short" }) → «25 окт.» */
export function fmtDate(iso: string, locale: string, opts: Intl.DateTimeFormatOptions) {
  if (locale.toLowerCase().startsWith("kk")) {
    const d = utc(iso);
    const wd = (d.getUTCDay() + 6) % 7;
    const m = d.getUTCMonth();
    const parts: string[] = [];
    if (opts.day) parts.push(String(d.getUTCDate()));
    if (opts.month) parts.push(opts.month === "long" ? KK.mLong[m] : KK.mShort[m]);
    const date = parts.join(" ");
    const day = opts.weekday ? (opts.weekday === "long" ? KK.wdLong[wd] : KK.wdShort[wd]) : "";
    return [date, day].filter(Boolean).join(", ");
  }
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(utc(iso));
}

/** Короткие названия дней недели с понедельника на языке сайта. */
export function weekdayNames(locale: string, style: "short" | "long" = "short") {
  return Array.from({ length: 7 }, (_, i) => fmtDate(addDays("2026-01-05", i), locale, { weekday: style })); // 05.01.2026 — понедельник
}

export const toMin = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
export const hm = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** «Сейчас» в часовом поясе бизнеса; обновляется раз в минуту. Снимок для поисковиков снят в другой день —
 *  в браузере всё пересчитывается при загрузке. */
export function useNow(tz = "Europe/Moscow") {
  const [now, setNow] = useState<Zoned>(() => zonedNow(tz));
  useEffect(() => {
    setNow(zonedNow(tz));
    const id = window.setInterval(() => setNow(zonedNow(tz)), 60_000);
    return () => window.clearInterval(id);
  }, [tz]);
  return now;
}
