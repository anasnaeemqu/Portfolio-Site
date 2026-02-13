import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  "data-testid": dataTestId,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}) {
  return (
    <section id={id} data-testid={dataTestId} className={cn("scroll-mt-24", className)}>
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="relative">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-[var(--shadow-2xs)]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="tracking-wide">{eyebrow}</span>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            {description ? (
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-right">
                {description}
              </p>
            ) : (
              <div />
            )}
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </motion.div>
    </section>
  );
}
