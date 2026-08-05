"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { AnimatedNumber } from "@/components/common/animated-number";
import { AvatarStack } from "@/components/common/avatar-stack";
import { CardEyebrow } from "@/components/common/card";
import { HealthIndicator } from "@/components/common/health-indicator";
import { Mark } from "@/components/common/mark";
import { ProgressBar } from "@/components/common/progress-bar";
import { SpecularCTA } from "@/components/common/specular-cta";
import { StatusBadge } from "@/components/common/status-badge";
import { StatusDot } from "@/components/common/status-dot";
import { Button } from "@/components/ui/button";
import { getPeople } from "@/lib/data/people";
import { dueLabel } from "@/lib/format";
import { priorityMeta } from "@/lib/project-meta";
import { cn } from "@/lib/utils";
import { pluralize } from "@/lib/text";
import type { ProjectDetail } from "@/types";

/**
 * A property cell in the header's inline strip — an eyebrow over its value,
 * divided from its neighbours by a hairline so the whole reads as one dense
 * instrument row rather than a set of floating stats.
 */
function Prop({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border-border/60 pl-5 first:pl-0 sm:border-l sm:first:border-l-0",
        className,
      )}
    >
      <CardEyebrow>{label}</CardEyebrow>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

/**
 * The project's command header. Not a floating hero card — it sits on the work
 * surface with a hairline base, orienting the eye without competing with the
 * task surface below. Identity and actions on top; a dense property strip
 * (progress, due, priority, AI health, team) integrated on the right.
 */
export function ProjectHero({ project }: { project: ProjectDetail }) {
  const team = getPeople(project.memberIds);
  const priority = priorityMeta[project.priority];
  const due = dueLabel(project.dueDate);

  return (
    <header className="border-b border-border/70 pb-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/projects"
          className="group -ml-1 inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Projects
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Star project"
            className="transition-transform active:scale-90"
            onClick={() => toast("Starred")}
          >
            <Star />
          </Button>
          <SpecularCTA onClick={() => toast("Share link copied")}>
            <Share2 className="size-4" />
            Share
          </SpecularCTA>
          <SpecularCTA onClick={() => toast("New task")}>
            <Plus className="size-4" />
            New task
          </SpecularCTA>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-x-10 gap-y-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <Mark
            seed={project.name}
            hue={project.hue}
            size="lg"
            className="size-13 rounded-2xl shadow-sm ring-1 ring-black/[0.04] ring-inset transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] motion-reduce:transform-none"
          />
          <div className="min-w-0 space-y-2 pt-0.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.625rem]">
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-5 gap-y-5 xl:shrink-0 xl:flex-nowrap">
          <Prop label="Progress">
            <div className="w-32 space-y-1.5">
              <AnimatedNumber
                value={project.progress}
                suffix="%"
                className="tabular block font-medium"
              />
              <ProgressBar value={project.progress} hue={project.hue} />
            </div>
          </Prop>
          <Prop label="Due">
            <span className={cn(due.overdue && "text-destructive")}>
              {due.label}
            </span>
          </Prop>
          <Prop label="Priority">
            <span className="inline-flex items-center gap-1.5">
              <StatusDot tone={priority.tone} />
              {priority.label}
            </span>
          </Prop>
          <Prop label="AI health">
            <HealthIndicator health={project.health} />
          </Prop>
          <Prop label="Team">
            <div className="flex items-center gap-2.5">
              <AvatarStack users={team} size="sm" max={5} />
              <span className="text-xs text-muted-foreground">
                {pluralize(team.length, "member")}
              </span>
            </div>
          </Prop>
        </div>
      </div>
    </header>
  );
}
