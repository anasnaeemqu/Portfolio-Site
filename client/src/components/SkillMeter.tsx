import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { Skill } from "@shared/schema";

function getIconByName(name?: string | null) {
  if (!name) return Icons.Code2;
  const key = name as keyof typeof Icons;
  return (Icons[key] as unknown as React.ComponentType<{ className?: string }>) ?? Icons.Code2;
}

export function SkillMeter({
  skill,
  "data-testid": dataTestId,
}: {
  skill: Skill;
  "data-testid"?: string;
}) {
  const Icon = getIconByName(skill.icon);

  const level = Math.max(0, Math.min(100, Number(skill.level ?? 0)));

  return (
    <div
      data-testid={dataTestId}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-4 shadow-[var(--shadow-2xs)]",
        "transition-all duration-300 hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl transition-opacity group-hover:opacity-100 opacity-80" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl border border-border/70 bg-background/60">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold tracking-tight">{skill.name}</div>
              <div className="mt-0.5 truncate text-xs font-semibold text-muted-foreground">
                {skill.category}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-full border border-border/70 bg-muted/60 px-2.5 py-1 text-xs font-bold text-muted-foreground">
          {level}%
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-primary/85 to-accent shadow-[0_8px_30px_hsl(var(--primary)/0.22)]"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Comfort</span>
          <span>Expert</span>
        </div>
      </div>
    </div>
  );
}
