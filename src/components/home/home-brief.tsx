"use client";

import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Ban,
  CalendarClock,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { CardEyebrow } from "@/components/common/card";
import { InsightStat } from "@/components/common/insight-stat";
import { Mark } from "@/components/common/mark";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeBrief } from "@/hooks/use-home";

/**
 * The Orbit brief — the page's answer to "what should I know right now?"
 *
 * Everything here is derived from the workspace: how many projects are slipping,
 * the nearest deadline, what's blocked, whether you were mentioned, and the one
 * next move (a project's own AI recommendation). It reads like a note from a
 * chief of staff, not a dashboard of numbers.
 */
export function HomeBrief() {
  const { data: brief, isPending } = useHomeBrief();

  return (
    <SpotlightCard
      className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6 shadow-xs sm:p-7"
      spotlightColor="rgba(120, 130, 240, 0.12)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15 ring-inset">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Your brief</h2>
            <CardEyebrow>Synthesized from your workspace</CardEyebrow>
          </div>
        </div>

        {isPending || !brief ? (
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-5 w-full max-w-xl" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : (
          <p className="mt-5 text-[14px] leading-relaxed text-foreground text-balance">
            {brief.headline}
          </p>
        )}

        {/* Derived signals — the numbers behind the sentence. */}
        <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-primary/10 pt-5 sm:grid-cols-4">
          {isPending || !brief ? (
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-8" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : (
            <>
              <InsightStat
                icon={TriangleAlert}
                tone={brief.needsAttention.length > 0 ? "danger" : "success"}
                value={brief.needsAttention.length || "All clear"}
                label={
                  brief.needsAttention.length === 1
                    ? "project needs you"
                    : brief.needsAttention.length > 1
                      ? "projects need you"
                      : "nothing slipping"
                }
              />
              <InsightStat
                icon={CalendarClock}
                tone={
                  brief.nearestDeadline && brief.nearestDeadline.dueInDays <= 14
                    ? "warning"
                    : "muted"
                }
                value={
                  brief.nearestDeadline ? `${brief.nearestDeadline.dueInDays}d` : "None"
                }
                label={
                  brief.nearestDeadline
                    ? `until ${brief.nearestDeadline.name}`
                    : "no deadlines"
                }
              />
              <InsightStat
                icon={Ban}
                tone={brief.blockers.length > 0 ? "warning" : "muted"}
                value={brief.blockers.length}
                label={brief.blockers.length === 1 ? "blocker" : "blockers"}
              />
              <InsightStat
                icon={AtSign}
                tone={brief.mentions > 0 ? "info" : "muted"}
                value={brief.mentions}
                label={brief.mentions === 1 ? "mention of you" : "mentions of you"}
              />
            </>
          )}
        </div>

        {/* The one next move. */}
        {isPending || !brief ? (
          <Skeleton className="mt-5 h-[68px] w-full rounded-xl" />
        ) : (
          brief.suggestion && (
            <Link
              href={`/projects/${brief.suggestion.slug}`}
              className="group mt-5 flex items-center gap-3.5 rounded-xl border border-primary/15 bg-background/60 p-3.5 outline-none transition-colors hover:border-primary/30 hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Mark
                seed={brief.suggestion.projectName}
                hue={brief.suggestion.hue}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <CardEyebrow>Suggested next step</CardEyebrow>
                <p className="mt-1 text-sm text-foreground">
                  {brief.suggestion.text}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 self-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                <span className="hidden sm:inline">Open</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        )}
      </div>
    </SpotlightCard>
  );
}
