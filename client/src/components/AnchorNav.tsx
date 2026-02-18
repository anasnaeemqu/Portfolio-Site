import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles } from "lucide-react";

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Qualifications" },
  { id: "projects", label: "Portfolio" },
  { id: "contact", label: "Contact" },
] as const;

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] ?? "home");

  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (inView?.target?.id) setActive(inView.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.45, 0.6],
        rootMargin: "-25% 0px -60% 0px",
      },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionIds.join("|")]);

  return active;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

import { ThemeToggle } from "./ThemeToggle";

export function AnchorNav({
  name,
  title,
  ctaLabel = "Let’s talk",
}: {
  name: string;
  title: string;
  ctaLabel?: string;
}) {
  const sectionIds = useMemo(() => NAV.map((n) => n.id), []);
  const active = useActiveSection(sectionIds);

  return (
    <header
      data-testid="navbar"
      className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/60 focus-premium"
            data-testid="nav-home"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("home");
            }}
          >
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <span className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/15 to-transparent" />
              <Sparkles className="relative h-4.5 w-4.5 text-primary" />
            </span>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold leading-none tracking-tight">{name}</div>
              <div className="mt-1 text-xs leading-none text-muted-foreground">{title}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`nav-${item.id}`}
                  onClick={() => scrollToId(item.id)}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200",
                    "hover:bg-muted/60 hover:text-foreground focus-premium",
                    isActive && "text-foreground",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-muted shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  ) : null}
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              data-testid="nav-cta"
              onClick={() => scrollToId("contact")}
              className="hidden rounded-full md:inline-flex"
            >
              {ctaLabel}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  data-testid="nav-mobile-open"
                  variant="secondary"
                  className="rounded-full md:hidden"
                  onClick={() => {}}
                >
                  <Menu className="h-4.5 w-4.5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] bg-background/80 backdrop-blur-xl">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigate</SheetTitle>
                </SheetHeader>

                <div className="mt-6 grid gap-2">
                  {NAV.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      data-testid={`nav-mobile-${item.id}`}
                      onClick={() => {
                        scrollToId(item.id);
                      }}
                      className={cn(
                        "w-full rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-left text-sm font-semibold",
                        "shadow-[var(--shadow-2xs)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-sm)] focus-premium",
                      )}
                    >
                      <span className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="text-xs text-muted-foreground">#{item.id}</span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    data-testid="nav-mobile-cta"
                    className="w-full rounded-2xl"
                    onClick={() => scrollToId("contact")}
                  >
                    {ctaLabel}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
