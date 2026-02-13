import { cn } from "@/lib/utils";

export function StatPill({
  label,
  value,
  tone = "primary",
  "data-testid": dataTestId,
}: {
  label: string;
  value: string;
  tone?: "primary" | "accent" | "neutral";
  "data-testid"?: string;
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/15 to-primary/5 text-foreground"
      : tone === "accent"
        ? "from-accent/15 to-accent/5 text-foreground"
        : "from-muted to-muted/50 text-foreground";

  return (
    <div
      data-testid={dataTestId}
      className={cn(
        "group inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-gradient-to-b px-4 py-3 shadow-[var(--shadow-2xs)]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]",
        toneClass,
      )}
    >
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="h-3 w-px bg-border/70" />
      <div className="text-sm font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
