import { cn } from "@/lib/cn";

type BadgeProps = {
  status: string;
  className?: string;
};

/** Badge trạng thái log — map sang label thân thiện, không hiện raw enum kỹ thuật. */
export function StatusBadge({ status, className }: BadgeProps) {
  const normalized = status.toLowerCase();
  const label =
    normalized === "success"
      ? "Success"
      : normalized === "error"
        ? "Failed"
        : normalized === "pending"
          ? "Pending"
          : status;

  const tone =
    normalized === "success"
      ? "bg-[var(--success-muted)] text-[var(--success)]"
      : normalized === "error"
        ? "bg-[var(--danger-muted)] text-[var(--danger)]"
        : "bg-[var(--warning-muted)] text-[var(--warning)]";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
