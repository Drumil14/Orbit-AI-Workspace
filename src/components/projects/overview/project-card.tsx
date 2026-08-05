"use client";

import Link from "next/link";
import { AnimatedNumber } from "@/components/common/animated-number";
import { AvatarStack } from "@/components/common/avatar-stack";
import { Card } from "@/components/common/card";
import { HealthIndicator } from "@/components/common/health-indicator";
import { Mark } from "@/components/common/mark";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { StatusDot } from "@/components/common/status-dot";
import { getPeople } from "@/lib/data/people";
import { dueLabel, relativeTime } from "@/lib/format";
import { priorityMeta } from "@/lib/project-meta";
import type { Project } from "@/types";

/** A premium, glanceable project card — the whole surface is the link target. */
export function ProjectCard({ project }: { project: Project }) {
  const team = getPeople(project.memberIds);
  const priority = priorityMeta[project.priority];
  const due = dueLabel(project.dueDate);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card
        interactive
        className="flex h-full flex-col p-5 group-hover:-translate-y-0.5 group-hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Mark seed={project.name} hue={project.hue} size="lg" />
            <div className="min-w-0">
              <h3 className="truncate font-semibold tracking-tight text-foreground">
                {project.name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <StatusDot tone={priority.tone} />
                {priority.label} priority
              </p>
            </div>
          </div>
          <StatusBadge status={project.status} className="shrink-0" />
        </div>

        <p className="mt-4 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{due.label}</span>
            <AnimatedNumber
              value={project.progress}
              suffix="%"
              className="tabular font-medium text-foreground"
            />
          </div>
          <ProgressBar
            value={project.progress}
            hue={project.hue}
            aria-label={`${project.progress}% complete`}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
          <AvatarStack users={team} size="sm" max={4} />
          <div className="flex items-center gap-2">
            <HealthIndicator health={project.health} showLabel={false} />
            <span className="text-xs text-muted-foreground">
              {relativeTime(project.lastActivityAt)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
