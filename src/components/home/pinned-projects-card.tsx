"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { Mark } from "@/components/common/mark";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusDot } from "@/components/common/status-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { usePinnedProjects } from "@/hooks/use-home";
import { projectStatusMeta } from "@/lib/status";

export function PinnedProjectsCard() {
  const { data, isPending } = usePinnedProjects();
  const projects = data?.slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pinned projects</CardTitle>
        <Link
          href="/projects"
          className="rounded text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          View all
        </Link>
      </CardHeader>

      <CardContent className="pt-1">
        {isPending || !projects ? (
          <ul className="flex flex-col gap-1">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="flex items-center gap-3 px-2 py-2.5">
                <Skeleton className="size-5 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-1 w-full" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {projects.map((project) => {
              const status = projectStatusMeta[project.status];
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <Mark seed={project.name} hue={project.hue} size="sm" />
                    <div className="min-w-0 flex-1">
                      <span className="truncate text-sm font-medium text-foreground">
                        {project.name}
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        <ProgressBar
                          value={project.progress}
                          hue={project.hue}
                          className="h-1.5 flex-1"
                          aria-label={`${project.name} ${project.progress}% complete`}
                        />
                        <span className="tabular w-8 text-right text-xs text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    <span className="flex w-24 shrink-0 items-center justify-end gap-1.5">
                      <StatusDot tone={status.tone} />
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        {status.label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
