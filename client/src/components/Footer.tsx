import { Link } from "wouter";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import type { Profile } from "@shared/schema";
import { cn } from "@/lib/utils";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  const socials = [
    {
      label: "LinkedIn",
      href: profile.linkedinUrl || "",
      icon: Linkedin,
      enabled: Boolean(profile.linkedinUrl),
      testId: "footer-linkedin",
    },
    {
      label: "GitHub",
      href: profile.githubUrl || "",
      icon: Github,
      enabled: Boolean(profile.githubUrl),
      testId: "footer-github",
    },
    {
      label: "Email",
      href: profile.email ? `mailto:${profile.email}` : "",
      icon: Mail,
      enabled: Boolean(profile.email),
      testId: "footer-email",
    },
  ] as const;

  return (
    <footer className="mt-20 border-t border-border/70 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <div className="text-xl font-extrabold tracking-tight">{profile.name}</div>
            <div className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {profile.tagline}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    type="button"
                    data-testid={s.testId}
                    disabled={!s.enabled}
                    onClick={() => {
                      if (!s.enabled) return;
                      window.open(s.href, "_blank", "noopener,noreferrer");
                    }}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-card/70 px-4 py-2 text-sm font-semibold",
                      "shadow-[var(--shadow-2xs)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-sm)] focus-premium",
                      !s.enabled && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-[var(--shadow-2xs)]",
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 text-primary" />
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:justify-end">
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Sections
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["Home", "home"],
                ["About", "about"],
                ["Skills", "skills"],
                ["Projects", "projects"],
                ["Experience", "experience"],
                ["Education", "education"],
                ["Contact", "contact"],
              ].map(([label, id]) => (
                <Link
                  key={id}
                  href="/"
                  data-testid={`footer-nav-${id}`}
                  className="rounded-xl px-2 py-2 font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-premium"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(id);
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div data-testid="footer-copyright">
            © {year} {profile.name}. Built with React + Tailwind.
          </div>
          <div className="font-semibold">
            <span className="text-muted-foreground">Tech palette:</span>{" "}
            <span className="text-foreground">Blue / Slate / Cyan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
