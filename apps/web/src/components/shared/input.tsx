import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? props.name ?? "input";

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
      <input
        id={inputId}
        className={cn(
          "min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] placeholder:text-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          className,
        )}
        {...props}
      />
    </label>
  );
}
