"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardEyebrow } from "@/components/common/card";
import { Mark } from "@/components/common/mark";
import { SpecularCTA } from "@/components/common/specular-cta";
import { Skeleton } from "@/components/ui/skeleton";
import { useContinueWorking } from "@/hooks/use-home";
import { atmosphere } from "@/lib/accent";

/**
 * The Home masthead — the page's one dominant surface.
 *
 * It fuses the greeting with "continue working" so the top of Home reads as a
 * single designed moment, not a header stacked above a card. The panel breathes
 * a faint share of the resumed project's atmosphere (its hue washes in from the
 * top-right), and the task title is the largest type on the page — everything
 * below is deliberately quieter.
 */
export function HomeHero({
  greeting,
  firstName,
}: {
  greeting: string;
  firstName: string;
}) {
  const { data, isPending } = useContinueWorking();
  const hue = data?.projectHue ?? "indigo";

  return (
    <Card className="relative overflow-hidden rounded-3xl p-6 sm:p-8">
      {/* The resumed project's hue, washing in from the corner — near-subliminal. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 130% at 100% 0%, color-mix(in oklab, ${atmosphere[hue]} 11%, transparent) 0%, transparent 56%)`,
        }}
      />

      <div className="relative">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            {greeting}, {firstName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-[0.875rem]">
            Everything moving in your space, in one calm view.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-5 border-t border-border/50 pt-6 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {isPending || !data ? (
              <Skeleton className="size-12 rounded-2xl" />
            ) : (
              <Mark
                seed={data.projectName}
                hue={data.projectHue}
                className="size-12 rounded-2xl"
              />
            )}

            <div className="min-w-0 space-y-1.5">
              <CardEyebrow>Continue working</CardEyebrow>
              {isPending || !data ? (
                <div className="space-y-2 py-0.5">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-3.5 w-44" />
                </div>
              ) : (
                <>
                  <p className="truncate text-xl font-semibold tracking-tight text-foreground">
                    {data.taskTitle}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {data.projectName} · updated {data.updatedAgo} ago
                  </p>
                </>
              )}
            </div>
          </div>

          <SpecularCTA
            className="self-start sm:self-auto"
            disabled={isPending || !data}
            onClick={() => toast(`Resuming ${data?.projectName}`)}
          >
            Resume
            <ArrowRight className="size-4" />
          </SpecularCTA>
        </div>
      </div>
    </Card>
  );
}
