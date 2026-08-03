"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/common/mark";
import { StatusDot } from "@/components/common/status-dot";
import { accentBar } from "@/lib/accent";
import { projectStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/** Ongoing projects get a live (pulsing) dot; paused/completed stay quiet. */
function isLive(status: Project["status"]): boolean {
  return status !== "paused" && status !== "completed";
}

export function ProjectRow({ project }: { project: Project }) {
  const pathname = usePathname();
  const href = `/projects/${project.slug}`;
  const active = pathname === href;
  const status = projectStatusMeta[project.status];

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
        active
          ? "bg-card text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      {/* Colored identity rule marks the active project. */}
      {active && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full",
            accentBar[project.hue],
          )}
        />
      )}
      <Mark
        seed={project.name}
        hue={project.hue}
        size="sm"
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span className="flex-1 truncate">{project.name}</span>
      <StatusDot tone={status.tone} pulse={isLive(project.status)} label={status.label} />
    </Link>
  );
}
