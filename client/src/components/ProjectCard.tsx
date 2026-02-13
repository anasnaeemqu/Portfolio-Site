import { ExternalLink, Github, Layers3, PlayCircle } from "lucide-react";
import type { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  onOpen,
  "data-testid": dataTestId,
}: {
  project: Project;
  onOpen: (project: Project) => void;
  "data-testid"?: string;
}) {
  const hasLive = Boolean(project.liveUrl);
  const hasRepo = Boolean(project.repoUrl);

  return (
    <div
      data-testid={dataTestId}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-5 shadow-[var(--shadow-xs)]",
        "transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-[var(--shadow-md)]",
      )}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-border/70 bg-background/60">
              <Layers3 className="h-5 w-5 text-primary" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-extrabold tracking-tight">{project.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
            </div>
          </div>
        </div>

        <Button
          data-testid={`project-open-${project.id}`}
          variant="secondary"
          className="rounded-2xl"
          onClick={() => onOpen(project)}
        >
          <PlayCircle className="mr-2 h-4.5 w-4.5" />
          Details
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(project.techStack ?? []).slice(0, 6).map((t) => (
          <Badge key={t} variant="secondary" className="rounded-full">
            {t}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {hasLive ? (
            <Button
              data-testid={`project-live-${project.id}`}
              onClick={() => window.open(project.liveUrl!, "_blank", "noopener,noreferrer")}
              className="rounded-2xl"
            >
              <ExternalLink className="mr-2 h-4.5 w-4.5" />
              Live / Demo
            </Button>
          ) : (
            <Button
              data-testid={`project-live-disabled-${project.id}`}
              onClick={() => {}}
              disabled
              className="rounded-2xl"
            >
              <ExternalLink className="mr-2 h-4.5 w-4.5" />
              Live / Demo
            </Button>
          )}
          {hasRepo ? (
            <Button
              data-testid={`project-repo-${project.id}`}
              variant="secondary"
              onClick={() => window.open(project.repoUrl!, "_blank", "noopener,noreferrer")}
              className="rounded-2xl"
            >
              <Github className="mr-2 h-4.5 w-4.5" />
              Repo
            </Button>
          ) : (
            <Button
              data-testid={`project-repo-disabled-${project.id}`}
              variant="secondary"
              onClick={() => {}}
              disabled
              className="rounded-2xl"
            >
              <Github className="mr-2 h-4.5 w-4.5" />
              Repo
            </Button>
          )}
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          Project #{project.order ?? 0}
        </div>
      </div>
    </div>
  );
}
