"use client";

import { format } from "date-fns";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { ScheduleEvent, ScheduleKind } from "@/types";

const kindRule: Record<ScheduleKind, string> = {
  meeting: "bg-indigo-500",
  focus: "bg-emerald-500",
  review: "bg-amber-500",
  personal: "bg-slate-400",
};

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

export function AgendaSchedule({ events }: { events: ScheduleEvent[] }) {
  const mounted = useMounted();
  // Only read the clock after mount so SSR and hydration agree.
  const nowMinutes = mounted
    ? new Date().getHours() * 60 + new Date().getMinutes()
    : -1;

  return (
    <section aria-label="Today's schedule">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Today
        </h2>
        {mounted && (
          <span className="text-xs text-muted-foreground/70">
            {format(new Date(), "EEE, MMM d")}
          </span>
        )}
      </header>

      <ol className="flex flex-col gap-0.5">
        {events.map((event) => {
          const started = nowMinutes >= toMinutes(event.start);
          const ended = nowMinutes >= toMinutes(event.end);
          const now = started && !ended;

          return (
            <li key={event.id}>
              <div
                className={cn(
                  "flex items-stretch gap-2.5 rounded-lg px-2 py-2 transition-colors",
                  now && "bg-accent",
                  ended && "opacity-45",
                )}
              >
                <span className="tabular w-10 shrink-0 pt-px text-xs text-muted-foreground">
                  {event.start}
                </span>
                <span
                  className={cn(
                    "w-0.5 shrink-0 rounded-full",
                    kindRule[event.kind],
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm text-foreground">
                      {event.title}
                    </span>
                    {now && (
                      <span className="shrink-0 text-[10px] font-medium tracking-wide text-primary uppercase">
                        Now
                      </span>
                    )}
                  </span>
                  <span className="tabular text-xs text-muted-foreground/70">
                    {event.start}–{event.end}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
