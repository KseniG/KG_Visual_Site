import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function MobileWelcome() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem("portfolio-welcome", "seen"); } catch { /* Необязательное окно. */ }
  };
  useEffect(() => {
    const portrait = window.matchMedia("(max-width: 767px) and (pointer: coarse) and (orientation: portrait)");
    const phone = window.matchMedia("(max-device-width: 767px) and (pointer: coarse)");
    let seen = false;
    try { seen = sessionStorage.getItem("portfolio-welcome") === "seen"; } catch { seen = false; }
    if (phone.matches && portrait.matches && !seen) {
      setOpen(true);
      try { sessionStorage.setItem("portfolio-welcome", "seen"); } catch { /* Необязательное окно. */ }
    }
    const changed = () => { if (!portrait.matches) setOpen(false); };
    portrait.addEventListener("change", changed);
    return () => portrait.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (open && !element?.open) element?.showModal();
    if (!open && element?.open) element.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      onCancel={close}
      onClose={close}
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
      className="mobile-welcome fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-md rounded-3xl border border-border bg-background p-6 text-foreground backdrop:bg-background/80"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Закрыть"
        className="absolute right-2 top-2 grid size-11 place-items-center rounded-full text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
      >
        <X className="size-5" aria-hidden />
      </button>
      <div className="flex flex-col gap-5">
        <div className="mx-auto w-36 overflow-hidden rounded-2xl">
          <img src={import.meta.env.BASE_URL + "img/zaglushka.svg"} alt="" width={144} height={108} className="aspect-[4/3] w-full" />
        </div>
        <h2 id="welcome-title" className="text-2xl font-medium text-primary">Небольшая рекомендация</h2>
        <p id="welcome-description" className="text-base leading-relaxed">
          Для лучшего просмотра портфолио рекомендуем повернуть телефон горизонтально
        </p>
        <p className="text-sm text-muted-foreground">Так будет удобнее рассматривать проекты ♡</p>
        <button
          type="button"
          onClick={close}
          className="min-h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:opacity-90"
        >
          Хорошо, смотрим!
        </button>
      </div>
    </dialog>
  );
}
