// Совместимость со старым API shadcn (useToast / toast). Внутри — sonner.
import { toast as sonner } from "sonner";

type ToastInput = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
  action?: { label: string; onClick: () => void };
};

function toast({ title, description, variant, duration, action }: ToastInput) {
  const fn = variant === "destructive" ? sonner.error : sonner;
  const id = fn(title ?? "", { description, duration, action });
  return { id, dismiss: () => sonner.dismiss(id), update: (next: ToastInput) => toast(next) };
}

function useToast() {
  return { toast, dismiss: (id?: string | number) => sonner.dismiss(id), toasts: [] as unknown[] };
}

export { toast, useToast };
