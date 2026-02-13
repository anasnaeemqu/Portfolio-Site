import type { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Github, X } from "lucide-react";

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="project-details-dialog"
        className="max-w-2xl rounded-3xl border-border/70 bg-background/80 p-0 backdrop-blur-xl"
      >
        <div className="p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="truncate text-2xl font-extrabold tracking-tight">
                  {project?.title ?? "Project"}
                </DialogTitle>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project?.summary ?? ""}
                </p>
              </div>
              <Button
                data-testid="project-details-close"
                variant="secondary"
                className="rounded-2xl"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="mt-6 grid gap-6">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Details
              </div>
              <div className="prose prose-sm mt-3 max-w-none text-foreground prose-p:leading-relaxed prose-a:text-primary">
                {(project?.details ?? "").trim() ? (
                  <p>{project?.details}</p>
                ) : (
                  <p className="text-muted-foreground">
                    No additional details yet. Add more context in the backend seed data to make
                    this section shine.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Tech Stack
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(project?.techStack ?? []).length ? (
                  (project?.techStack ?? []).map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tech stack provided.</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                data-testid="project-details-live"
                className="rounded-2xl"
                disabled={!project?.liveUrl}
                onClick={() => {
                  if (!project?.liveUrl) return;
                  window.open(project.liveUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <ExternalLink className="mr-2 h-4.5 w-4.5" />
                Live / Demo
              </Button>
              <Button
                data-testid="project-details-repo"
                variant="secondary"
                className="rounded-2xl"
                disabled={!project?.repoUrl}
                onClick={() => {
                  if (!project?.repoUrl) return;
                  window.open(project.repoUrl, "_blank", "noopener,noreferrer");
                }}
              >
                <Github className="mr-2 h-4.5 w-4.5" />
                Repository
              </Button>
            </div>

            <div className="text-xs font-semibold text-muted-foreground">
              Tip: add an <span className="font-bold">imageUrl</span> field and render it here if
              you want a visual hero for each project.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
