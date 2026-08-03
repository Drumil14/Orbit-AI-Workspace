"use client";

import { format } from "date-fns";
import { CalendarClock, TriangleAlert } from "lucide-react";
import { Card, CardEyebrow } from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useSchedule } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";
import type { ScheduleEvent, ScheduleKind } from "@/types";

const START_H = 8;
const END_H = 19;
const HOUR_H = 62; // px per hour

const kindStyle: Record<ScheduleKind, { block: string; dot: string; label: string }> = {
  meeting: { block: "border-l-indigo-500 bg-indigo-500/10", dot: "bg-indigo-500", label: "Meeting" },
  focus: { block: "border-l-emerald-500 bg-emerald-500/10", dot: "bg-emerald-500", label: "Focus" },
  review: { block: "border-l-amber-500 bg-amber-500/10", dot: "bg-amber-500", label: "Review" },
  personal: { block: "border-l-slate-400 bg-slate-400/10", dot: "bg-slate-400", label: "Personal" },
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h! * 60 + m!;
};
const hourLabel = (h: number) =>
  `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;
const clockLabel = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h! < 12 ? "AM" : "PM"}`;
};
const durationLabel = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ") || "0m";
};
const y = (minutes: number) => ((minutes - START_H * 60) / 60) * HOUR_H;

function EventBlock({ event }: { event: ScheduleEvent }) {
  const style = kindStyle[event.kind];
  const top = y(toMinutes(event.start));
  const height = Math.max(y(toMinutes(event.end)) - top, 24);
  return (
    <div
      className={cn(
        "absolute right-0 left-2 overflow-hidden rounded-lg border border-border/50 border-l-2 px-3 py-1.5",
        style.block,
      )}
      style={{ top, height }}
    >
      <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
      <p className="tabular text-xs text-muted-foreground">
        {event.start}–{event.end}
      </p>
    </div>
  );
}

export function ScheduleView() {
  const { data, isPending, isError, refetch } = useSchedule();
  const mounted = useMounted();
  const nowMin = mounted ? new Date().getHours() * 60 + new Date().getMinutes() : -1;
  const nowVisible = nowMin >= START_H * 60 && nowMin <= END_H * 60;
  const hours = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);

  // Derived read on the day: how much of it is meetings vs. protected focus,
  // and what's next from where the clock is now.
  const meetings = data?.filter((e) => e.kind === "meeting").length ?? 0;
  const focusMin =
    data
      ?.filter((e) => e.kind === "focus")
      .reduce((sum, e) => sum + (toMinutes(e.end) - toMinutes(e.start)), 0) ?? 0;
  const nextEvent =
    mounted && data
      ? [...data]
          .filter((e) => toMinutes(e.start) > nowMin)
          .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))[0]
      : undefined;

  if (isPending) return <Skeleton className="h-[640px] rounded-2xl" />;
  if (isError || !data) {
    return (
      <EmptyState
        icon={TriangleAlert}
        title="Couldn't load your schedule"
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const busyMin = data.reduce(
    (sum, e) => sum + (toMinutes(e.end) - toMinutes(e.start)),
    0,
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* The day itself — the primary surface. */}
      <Card className="p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarClock className="size-4 text-muted-foreground" />
          {mounted ? format(new Date(), "EEEE, MMMM d") : "Today"}
        </div>

        <div className="relative" style={{ height: (END_H - START_H) * HOUR_H }}>
          {hours.map((h) => (
            <div
              key={h}
              className="absolute right-0 left-0 flex items-start gap-3"
              style={{ top: y(h * 60) }}
            >
              <span className="tabular -mt-2 w-12 shrink-0 text-right text-xs text-muted-foreground/70">
                {hourLabel(h)}
              </span>
              <span className="mt-px h-px flex-1 bg-border/60" />
            </div>
          ))}

          <div className="absolute inset-y-0 right-0 left-14">
            {data.map((event) => (
              <EventBlock key={event.id} event={event} />
            ))}

            {mounted && nowVisible && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-10 flex items-center"
                style={{ top: y(nowMin) }}
              >
                <span className="size-2 shrink-0 rounded-full bg-destructive" />
                <span className="h-px flex-1 bg-destructive/60" />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Day summary rail — quiet context beside the schedule. */}
      <aside className="space-y-6">
        <Card className="p-5">
          <CardEyebrow>Up next</CardEyebrow>
          {nextEvent ? (
            <div className="mt-2.5">
              <p className="text-sm font-semibold text-foreground">
                {nextEvent.title}
              </p>
              <p className="tabular mt-0.5 text-xs text-muted-foreground">
                {clockLabel(nextEvent.start)} ·{" "}
                {durationLabel(
                  toMinutes(nextEvent.end) - toMinutes(nextEvent.start),
                )}
              </p>
            </div>
          ) : (
            <p className="mt-2.5 text-sm text-muted-foreground">
              {mounted ? "Nothing left on the calendar." : "—"}
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border/60 pt-4">
            <div>
              <p className="tabular text-xl font-semibold tracking-tight text-foreground">
                {meetings}
              </p>
              <p className="text-xs text-muted-foreground">
                meeting{meetings === 1 ? "" : "s"}
              </p>
            </div>
            <div>
              <p className="tabular text-xl font-semibold tracking-tight text-foreground">
                {durationLabel(focusMin)}
              </p>
              <p className="text-xs text-muted-foreground">of focus</p>
            </div>
            <div className="col-span-2">
              <p className="tabular text-xl font-semibold tracking-tight text-foreground">
                {durationLabel(busyMin)}
              </p>
              <p className="text-xs text-muted-foreground">
                scheduled across {data.length} block{data.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <CardEyebrow>Legend</CardEyebrow>
          <ul className="mt-3 space-y-2.5">
            {Object.values(kindStyle).map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <span className={cn("size-2.5 rounded-full", s.dot)} />
                {s.label}
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
