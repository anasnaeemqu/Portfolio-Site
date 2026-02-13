import type { Education } from "@shared/schema";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function EducationList({
  items,
  "data-testid": dataTestId,
}: {
  items: Education[];
  "data-testid"?: string;
}) {
  return (
    <div data-testid={dataTestId} className="grid gap-4 lg:grid-cols-2">
      {items.map((e) => {
        const years = [e.startYear, e.endYear].filter(Boolean).join(" — ");
        return (
          <div
            key={e.id}
            data-testid={`education-${e.id}`}
            className={cn(
              "group rounded-3xl border border-border/70 bg-card/70 p-5 shadow-[var(--shadow-xs)]",
              "transition-all duration-300 hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-md)]",
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-background/60">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-extrabold tracking-tight">{e.school}</div>
                    <div className="mt-1 text-sm font-semibold text-muted-foreground">
                      {e.degree}
                      {e.field ? <span className="text-muted-foreground"> · {e.field}</span> : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2 text-xs font-bold text-muted-foreground">
                {years || "—"}
              </div>
            </div>

            {e.description?.trim() ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
