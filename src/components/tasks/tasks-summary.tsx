"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, CalendarClock, Eye, ListChecks, Sparkles } from "lucide-react";
import { Card, CardEyebrow } from "@/components/common/card";
import { InsightStat } from "@/components/common/insight-stat";
import { Mark } from "@/components/common/mark";
import type { TaskDigest } from "@/lib/insights";

/**
 * A read on your own workload, up top: how much is open, what's due today,
 * what's in review, and the one task to start with — so the page answers
 * "where do I begin?" before you scroll.
 */
export function TasksSummary({ digest }: { digest: TaskDigest }) {
  return (
    <Card className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-6">
      <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
        <InsightStat icon={ListChecks} value={digest.active} label="on your plate" />
        <InsightStat
          icon={CalendarClock}
          tone={digest.dueToday > 0 ? "warning" : "muted"}
          value={digest.dueToday}
          label="due today"
        />
        <InsightStat
          icon={ArrowUp}
          tone={digest.highPriority > 0 ? "danger" : "muted"}
          value={digest.highPriority}
          label="high priority"
        />
        <InsightStat
          icon={Eye}
          tone={digest.inReview > 0 ? "info" : "muted"}
          value={digest.inReview}
          label="in review"
        />
      </div>

      {digest.suggestion && (
        <Link
          href={`/projects/${digest.suggestion.slug}`}
          className="group flex shrink-0 items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 outline-none transition-colors hover:border-border hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-72 lg:border-0 lg:border-l lg:border-border/70 lg:bg-transparent lg:pr-1 lg:pl-6"
        >
          <Mark
            seed={digest.suggestion.projectName}
            hue={digest.suggestion.hue}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <CardEyebrow className="flex items-center gap-1">
              <Sparkles className="size-3 text-primary" />
              Start here
            </CardEyebrow>
            <p className="mt-0.5 truncate text-sm font-medium text-foreground">
              {digest.suggestion.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {digest.suggestion.projectName}
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      )}
    </Card>
  );
}
