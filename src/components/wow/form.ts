/*
  Общий код форм вау-блоков (src/components/wow/form.ts, импорт — "./form"): настоящая отправка в «Заявки» Лепки
  (submitForm), имя, телефон, комментарий, согласие со ссылкой на политику, скрытое поле company_site, состояния
  «отправляется / готово / ошибка». Надписи — из словаря i18n на языке сайта. Без JSX — сервер копирует помощники *.ts.
*/
import { createElement, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { submitForm, type FormValue } from "@/lib/lepka-forms";
import { cn } from "@/lib/utils";
import { focusRing } from "./lib";
import { type Key } from "./i18n";

type T = (key: Key, vars?: Record<string, string | number>) => string;
export type FormState = "idle" | "sending" | "done" | "error";
type Errors = Partial<Record<string, string>>;

/** Состояние формы заявки. submit(e, поля, своя проверка) — проверяет имя, телефон и согласие, отправляет. */
export function useLeadForm({ formName, t }: { formName: string; t: T }) {
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<FormState>("idle");
  const [fail, setFail] = useState("");

  const submit = async (e: FormEvent, fields: Record<string, FormValue>, extra?: () => Errors) => {
    e.preventDefault();
    const schema = z.object({
      name: z.string().trim().min(2, t("errName")),
      phone: z.string().refine((v) => v.replace(/\D/g, "").length >= 10, t("errPhone")),
      consent: z.literal(true, { errorMap: () => ({ message: t("errConsent") }) }),
    });
    const errs: Errors = { ...(extra?.() ?? {}) };
    const r = schema.safeParse({ name, phone: tel, consent });
    if (!r.success) r.error.issues.forEach((i) => (errs[String(i.path[0])] ??= i.message));
    for (const k of Object.keys(errs)) if (!errs[k]) delete errs[k];
    setErrors(errs);
    if (Object.keys(errs).length) return false;
    setState("sending");
    try {
      await submitForm(
        formName,
        { [t("leadName")]: name.trim(), [t("leadPhone")]: tel, ...fields, [t("leadComment")]: comment.trim() || undefined },
        { honeypot },
      );
      setState("done");
      return true;
    } catch (err) {
      setFail(err instanceof Error ? err.message : t("failDefault"));
      setState("error");
      return false;
    }
  };

  return { name, setName, tel, setTel, comment, setComment, consent, setConsent, honeypot, setHoneypot, errors, state, fail, submit };
}
export type LeadFormApi = ReturnType<typeof useLeadForm>;

export const inputClass =
  "peer block w-full rounded-[var(--radius)] border border-input bg-background px-4 pb-2 pt-6 text-lg text-foreground outline-none transition-colors placeholder:text-transparent focus:border-ring focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive";

/** Поле с подписью, которая поднимается при вводе. */
export function Field({ id, label, error, children }: { id: string; label: string; error?: string; children?: ReactNode }) {
  return createElement(
    "div",
    { className: "relative" },
    children,
    createElement(
      "label",
      {
        htmlFor: id,
        className:
          "pointer-events-none absolute left-4 top-4 origin-left text-base text-muted-foreground transition-transform duration-200 peer-focus:-translate-y-3 peer-focus:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 motion-reduce:transition-none",
      },
      label,
    ),
    error ? createElement("p", { id: `${id}-err`, className: "mt-1.5 text-sm text-destructive" }, error) : null,
  );
}

/** Имя, телефон и (по желанию) комментарий — общие поля всех форм. */
export function ContactFields({ f, t, id, comment = true }: { f: LeadFormApi; t: T; id: string; comment?: boolean }) {
  const input = (key: "name" | "tel", props: Record<string, unknown>) =>
    createElement("input", {
      id: `${id}-${key}`,
      className: cn(inputClass, key === "tel" && "lining-nums"),
      placeholder: key === "name" ? t("name") : t("phone"),
      value: key === "name" ? f.name : f.tel,
      onChange: (e: { target: { value: string } }) => (key === "name" ? f.setName : f.setTel)(e.target.value),
      "aria-invalid": Boolean(f.errors[key === "name" ? "name" : "phone"]),
      ...props,
    });
  return createElement(
    "div",
    { className: "space-y-5" },
    createElement(
      "div",
      { className: "grid gap-5 sm:grid-cols-2" },
      createElement(Field, { id: `${id}-name`, label: t("name"), error: f.errors.name }, input("name", { autoComplete: "name" })),
      createElement(Field, { id: `${id}-tel`, label: t("phone"), error: f.errors.phone }, input("tel", { type: "tel", inputMode: "tel", autoComplete: "tel" })),
    ),
    comment
      ? createElement(
          Field,
          { id: `${id}-msg`, label: t("comment") },
          createElement("textarea", {
            id: `${id}-msg`,
            rows: 2,
            className: cn(inputClass, "resize-none"),
            placeholder: t("comment"),
            value: f.comment,
            onChange: (e: { target: { value: string } }) => f.setComment(e.target.value),
          }),
        )
      : null,
  );
}

/** Скрытое поле от спама, согласие со ссылкой на политику, кнопка и ошибка с запасным телефоном. */
export function FormFooter({ f, t, button, privacyHref = "/privacy", phone }: { f: LeadFormApi; t: T; button: string; privacyHref?: string; phone?: string }) {
  return createElement(
    "div",
    { className: "space-y-5" },
    createElement("input", {
      type: "text",
      name: "company_site",
      tabIndex: -1,
      autoComplete: "off",
      "aria-hidden": "true",
      value: f.honeypot,
      onChange: (e: { target: { value: string } }) => f.setHoneypot(e.target.value),
      className: "absolute -left-[9999px] h-0 w-0 opacity-0",
    }),
    createElement(
      "div",
      null,
      createElement(
        "label",
        { className: "flex cursor-pointer items-start gap-3 text-sm leading-snug text-muted-foreground" },
        createElement("input", {
          type: "checkbox",
          checked: f.consent,
          onChange: (e: { target: { checked: boolean } }) => f.setConsent(e.target.checked),
          "aria-invalid": Boolean(f.errors.consent),
          className: "mt-0.5 size-5 shrink-0 accent-[var(--color-primary)]",
        }),
        createElement(
          "span",
          null,
          `${t("consentPre")} `,
          createElement("a", { href: privacyHref, className: "underline underline-offset-2 hover:text-foreground" }, t("consentLink")),
        ),
      ),
      f.errors.consent ? createElement("p", { className: "mt-1.5 text-sm text-destructive" }, f.errors.consent) : null,
    ),
    createElement(
      "button",
      {
        type: "submit",
        disabled: f.state === "sending",
        className: cn(
          "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-8 text-lg font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto",
          focusRing,
        ),
      },
      f.state === "sending" ? createElement(Loader2, { "aria-hidden": true, className: "size-5 animate-spin" }) : null,
      button,
    ),
    f.state === "error"
      ? createElement(
          "p",
          { role: "alert", className: "text-base text-destructive" },
          `${f.fail}. `,
          phone ? `${t("failCall")} ` : null,
          phone ? createElement("a", { href: `tel:${phone.replace(/[^\d+]/g, "")}`, className: "font-medium underline" }, phone) : null,
        )
      : null,
  );
}

/** Галочка, которая прорисовывается после отправки. */
export function SuccessCheck({ calm, className }: { calm: boolean; className?: string }) {
  return createElement(
    "svg",
    { viewBox: "0 0 64 64", "aria-hidden": true, className: cn("size-16 text-primary", className) },
    createElement("circle", { cx: 32, cy: 32, r: 30, fill: "none", stroke: "currentColor", strokeWidth: 2.5, opacity: 0.25 }),
    createElement(motion.path, {
      d: "M19 33 L28 42 L46 23",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 4,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      initial: calm ? false : { pathLength: 0 },
      animate: { pathLength: 1 },
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
    }),
  );
}
