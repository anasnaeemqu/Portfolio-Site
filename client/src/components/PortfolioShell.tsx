import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function PortfolioShell({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("min-h-screen mesh-bg noise-overlay", className)}>
      {children}
    </div>
  );
}
