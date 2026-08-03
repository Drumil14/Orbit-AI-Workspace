import { Sparkles } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { AnimatedNumber } from "@/components/common/animated-number";
import { CardEyebrow } from "@/components/common/card";
import { ProgressBar } from "@/components/common/progress-bar";
import { StatusDot } from "@/components/common/status-dot";
import type { AiSummary } from "@/types";

/**
 * The AI project briefing — the rail's one accent surface, so "intelligence"
 * has a single, unmistakable home. A soft indigo sheen and cursor spotlight set
 * it apart from the quiet utility panels beneath it; the content reads top to
 * bottom like a note from the project lead: goal, risks, next move, estimate.
 */
export function AiSummaryCard({ ai }: { ai: AiSummary }) {
  return (
    <SpotlightCard
      className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 shadow-sm"
      spotlightColor="rgba(120, 130, 240, 0.14)"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15 ring-inset">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                AI summary
              </h2>
              <p className="text-xs text-muted-foreground">
                From recent activity
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="tabular text-xs text-muted-foreground">
              <AnimatedNumber value={ai.confidence} suffix="%" />
            </span>
            <ProgressBar value={ai.confidence} className="w-16" />
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground">{ai.goal}</p>

        <div className="mt-5 space-y-4 border-t border-primary/10 pt-4">
          <div>
            <CardEyebrow>Risks</CardEyebrow>
            <ul className="mt-2 space-y-2">
              {ai.risks.map((risk) => (
                <li
                  key={risk}
                  className="flex gap-2.5 text-sm text-muted-foreground"
                >
                  <StatusDot tone="warning" className="mt-1.5" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <CardEyebrow>Next recommendation</CardEyebrow>
            <p className="mt-2 rounded-lg border border-primary/15 bg-background/60 p-3 text-sm text-foreground">
              {ai.recommendation}
            </p>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <CardEyebrow>Est. completion</CardEyebrow>
            <p className="text-sm font-medium text-foreground">
              {ai.estimatedCompletion}
            </p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
