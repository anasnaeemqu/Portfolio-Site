import { Briefcase, MapPin, Sparkles } from "lucide-react";
import type { Experience } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function Timeline({
  items,
  "data-testid": dataTestId,
}: {
  items: Experience[];
  "data-testid"?: string;
}) {
  return (
    <div data-testid={dataTestId} className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-border to-transparent md:left-6" />
      <div className="grid gap-4">
        {items.map((exp) => {
          const period = `${exp.startDate}${exp.isCurrent ? " — Present" : exp.endDate ? ` — ${exp.endDate}` : ""}`;
          return (
            <div
              key={exp.id}
              data-testid={`experience-${exp.id}`}
              className={cn(
                "relative ml-0 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-[var(--shadow-xs)]",
                "transition-all duration-300 hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-md)]",
                "pl-12 md:pl-16",
              )}
            >
              <div className="absolute left-1.5 top-6 grid h-7 w-7 place-items-center rounded-2xl border border-border/70 bg-background/80 shadow-[var(--shadow-2xs)] md:left-3">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold tracking-tight">{exp.role}</h3>
                    {exp.isCurrent ? (
                      <Badge className="rounded-full bg-gradient-to-r from-accent to-primary text-primary-foreground">
                        Current
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      {exp.company}
                    </span>
                    {exp.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {exp.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2 text-xs font-bold text-muted-foreground">
                  {period}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{exp.description}</p>

              {(exp.achievements ?? []).length ? (
                <ul className="mt-4 grid gap-2">
                  {(exp.achievements ?? []).map((a, idx) => (
                    <li key={`${exp.id}-${idx}`} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-primary/70" />
                      <span className="text-foreground/90">{a}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
