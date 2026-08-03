"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleCheck,
  FolderKanban,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { Card, CardEyebrow } from "@/components/common/card";
import { InsightStat } from "@/components/common/insight-stat";
import { Mark } from "@/components/common/mark";
import type { PortfolioDigest } from "@/lib/insights";

/**
 * The Projects overview's opening line: a portfolio-level read that tells you
 * how the whole set is trending and which project to open first — before you
 * scan a single card.
 */
export function ProjectsDigest({
  digest,
  showLead = true,
}: {
  digest: PortfolioDigest;
  /** Hide the "Start here" callout when a featured hero already carries it. */
  showLead?: boolean;
}) {
  return (
    <Card className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:gap-6">
      <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
        <InsightStat
          icon={FolderKanban}
          value={digest.total}
          label="in motion"
        />
        <InsightStat
          icon={CircleCheck}
          tone="success"
          value={digest.onTrack}
          label="on track"
        />
        <InsightStat
          icon={TriangleAlert}
          tone={digest.attention > 0 ? "danger" : "success"}
          value={digest.attention || "0"}
          label="need attention"
        />
        <InsightStat
          icon={CalendarClock}
          tone={
            digest.nearestDeadline && digest.nearestDeadline.dueInDays <= 14
              ? "warning"
              : "muted"
          }
          value={
            digest.nearestDeadline ? `${digest.nearestDeadline.dueInDays}d` : "None"
          }
          label={
            digest.nearestDeadline
              ? `until ${digest.nearestDeadline.name}`
              : "no deadlines"
          }
        />
      </div>

      {showLead && digest.lead && (
        <Link
          href={`/projects/${digest.lead.slug}`}
          className="group flex shrink-0 items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 outline-none transition-colors hover:border-border hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-72 lg:border-0 lg:border-l lg:border-border/70 lg:bg-transparent lg:pr-1 lg:pl-6"
        >
          <Mark seed={digest.lead.name} hue={digest.lead.hue} size="lg" />
          <div className="min-w-0 flex-1">
            <CardEyebrow className="flex items-center gap-1">
              <Sparkles className="size-3 text-primary" />
              Start here
            </CardEyebrow>
            <p className="mt-0.5 truncate text-sm font-medium text-foreground">
              {digest.lead.name}
            </p>
            <p className="truncate text-xs text-muted-foreground first-letter:uppercase">
              {digest.lead.reason}
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>
      )}
    </Card>
  );
}
