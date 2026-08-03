"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { AnimatedNumber } from "@/components/common/animated-number";
import { AvatarStack } from "@/components/common/avatar-stack";
import { CardEyebrow } from "@/components/common/card";
import { HealthIndicator } from "@/components/common/health-indicator";
import { Mark } from "@/components/common/mark";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusBadge } from "@/components/common/status-badge";
import { atmosphere } from "@/lib/accent";
import { getPeople } from "@/lib/data/people";
import { dueLabel } from "@/lib/format";
import { pluralize } from "@/lib/text";
import type { Project } from "@/types";

/**
 * The overview's focal point: the one project most worth opening, given the
 * whole page a center of gravity instead of a wall of equal cards. It breathes
 * the project's own hue, follows the cursor with a soft spotlight, and splits
 * into a narrative half (what and why) and an instrument half (status, progress,
 * team) so the eye has a clear path through it.
 */
export function FeaturedProject({
  project,
  reason,
}: {
  project: Project;
  reason: string;
}) {
  const team = getPeople(project.memberIds);
  const due = dueLabel(project.dueDate);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <SpotlightCard
        className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-border group-hover:shadow-lg sm:p-8"
        spotlightColor="rgba(120, 130, 240, 0.10)"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(130% 130% at 100% 0%, color-mix(in oklab, ${atmosphere[project.hue]} 9%, transparent) 0%, transparent 58%)`,
          }}
        />

        <div className="relative grid gap-7 lg:grid-cols-[1.55fr_1fr] lg:gap-10">
          {/* Narrative half */}
          <div className="min-w-0">
            <CardEyebrow className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-primary" />
              Needs your attention
            </CardEyebrow>

            <div className="mt-3.5 flex items-center gap-4">
              <Mark
                seed={project.name}
                hue={project.hue}
                className="size-14 rounded-2xl"
              />
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {project.name}
                </h2>
                <p className="mt-0.5 truncate text-sm text-muted-foreground first-letter:uppercase">
                  {reason}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Jump in
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>

          {/* Instrument half */}
          <div className="flex flex-col justify-between gap-6 border-t border-border/50 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <div className="flex items-center justify-between">
              <StatusBadge status={project.status} />
              <HealthIndicator health={project.health} />
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{due.label}</span>
                <AnimatedNumber
                  value={project.progress}
                  suffix="%"
                  className="tabular font-semibold text-foreground"
                />
              </div>
              <ProgressBar
                value={project.progress}
                className="h-1.5"
                aria-label={`${project.progress}% complete`}
              />
            </div>

            <div className="flex items-center justify-between">
              <AvatarStack users={team} size="sm" max={5} />
              <span className="text-xs text-muted-foreground">
                {pluralize(team.length, "member")}
              </span>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
