"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarClock, Plus, TriangleAlert } from "lucide-react";
import { Card, CardEyebrow } from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import {
  useCreateEvent,
  useSchedule,
  useUpdateEvent,
} from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";
import type { ScheduleEvent, ScheduleKind } from "@/types";
import { EventEditor } from "./event-editor";

const START_H = 8;
const END_H = 19;
const HOUR_H = 62; // px per hour
const DAY_START = START_H * 60;
const DAY_END = END_H * 60;
const SNAP = 15; // minutes

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
const hhmm = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const hourLabel = (h: number) => `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;
const clockLabel = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h! < 12 ? "AM" : "PM"}`;
};
const durationLabel = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ") || "0m";
};
const y = (minutes: number) => ((minutes - DAY_START) / 60) * HOUR_H;
const snap = (min: number) => Math.round(min / SNAP) * SNAP;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Mode = "create" | "move" | "resize-start" | "resize-end";
interface Interaction {
  mode: Mode;
  id?: string;
  start: number;
  end: number;
  anchor: number; // grab point / create origin
  origStart: number;
  origEnd: number;
  moved: boolean;
}

export function ScheduleView() {
  const { data, isPending, isError, refetch } = useSchedule();
  const create = useCreateEvent();
  const update = useUpdateEvent();
  const mounted = useMounted();

  const layerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Interaction | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const nowMin = mounted ? new Date().getHours() * 60 + new Date().getMinutes() : -1;
  const nowVisible = nowMin >= DAY_START && nowMin <= DAY_END;
  const hours = Array.from({ length: END_H - START_H + 1 }, (_, i) => START_H + i);

  const minFromClientY = (clientY: number) => {
    const rect = layerRef.current?.getBoundingClientRect();
    if (!rect) return DAY_START;
    const raw = DAY_START + ((clientY - rect.top) / HOUR_H) * 60;
    return clamp(snap(raw), DAY_START, DAY_END);
  };

  const openEditor = (id: string) => {
    setEditingId(id);
    setEditorOpen(true);
  };

  const beginCreate = (e: React.PointerEvent) => {
    // Only start a create on the empty grid, not on an existing event.
    if (e.target !== layerRef.current) return;
    const at = minFromClientY(e.clientY);
    layerRef.current?.setPointerCapture(e.pointerId);
    setDrag({ mode: "create", start: at, end: at + SNAP, anchor: at, origStart: at, origEnd: at, moved: false });
  };

  const beginOnEvent = (e: React.PointerEvent, event: ScheduleEvent, mode: Mode) => {
    e.stopPropagation();
    const s = toMinutes(event.start);
    const en = toMinutes(event.end);
    layerRef.current?.setPointerCapture(e.pointerId);
    setDrag({
      mode,
      id: event.id,
      start: s,
      end: en,
      anchor: minFromClientY(e.clientY),
      origStart: s,
      origEnd: en,
      moved: false,
    });
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const cur = minFromClientY(e.clientY);
    let next: Interaction;
    if (drag.mode === "create") {
      const start = Math.min(drag.anchor, cur);
      const end = Math.max(drag.anchor, cur);
      next = { ...drag, start, end: Math.max(end, start + SNAP), moved: true };
    } else if (drag.mode === "move") {
      const dur = drag.origEnd - drag.origStart;
      const delta = cur - drag.anchor;
      const start = clamp(drag.origStart + delta, DAY_START, DAY_END - dur);
      next = { ...drag, start, end: start + dur, moved: true };
    } else if (drag.mode === "resize-start") {
      const start = clamp(cur, DAY_START, drag.origEnd - SNAP);
      next = { ...drag, start, end: drag.origEnd, moved: true };
    } else {
      const end = clamp(cur, drag.origStart + SNAP, DAY_END);
      next = { ...drag, start: drag.origStart, end, moved: true };
    }
    setDrag(next);
  };

  const onUp = (e: React.PointerEvent) => {
    if (!drag) return;
    try {
      layerRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // capture may already be released
    }
    const it = drag;
    setDrag(null);

    if (it.mode === "create") {
      const start = it.start;
      const end = it.moved ? it.end : Math.min(start + 60, DAY_END);
      if (end - start < SNAP) return;
      create.mutate(
        { title: "New block", kind: "focus", start: hhmm(start), end: hhmm(end) },
        { onSuccess: (ev) => openEditor(ev.id) },
      );
      return;
    }

    if (!it.moved && it.id) {
      openEditor(it.id); // a click on the event
      return;
    }
    if (it.id) {
      update.mutate({
        id: it.id,
        patch: { start: hhmm(it.start), end: hhmm(it.end) },
      });
    }
  };

  const newEventFromButton = () => {
    // A keyboard/click path to create: next free-ish hour, one hour long.
    const base = mounted ? clamp(snap(nowMin), DAY_START, DAY_END - 60) : 9 * 60;
    create.mutate(
      { title: "New block", kind: "focus", start: hhmm(base), end: hhmm(base + 60) },
      { onSuccess: (ev) => openEditor(ev.id) },
    );
  };

  const editingEvent = data?.find((e) => e.id === editingId) ?? null;

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
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* The day itself — the primary surface. */}
        <Card className="p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarClock className="size-4 text-muted-foreground" />
              {mounted ? format(new Date(), "EEEE, MMMM d") : "Today"}
            </div>
            <Button variant="outline" size="sm" onClick={newEventFromButton}>
              <Plus className="size-4" />
              New event
            </Button>
          </div>

          <p className="mb-3 text-xs text-muted-foreground">
            Drag on an empty slot to create · drag an event to move · drag its
            edges to resize.
          </p>

          <div className="relative" style={{ height: (END_H - START_H) * HOUR_H }}>
            {hours.map((h) => (
              <div
                key={h}
                className="pointer-events-none absolute right-0 left-0 flex items-start gap-3"
                style={{ top: y(h * 60) }}
              >
                <span className="tabular -mt-2 w-12 shrink-0 text-right text-xs text-muted-foreground/70">
                  {hourLabel(h)}
                </span>
                <span className="mt-px h-px flex-1 bg-border/60" />
              </div>
            ))}

            {/* Interactive event layer. Empty-area pointerdown starts a create. */}
            <div
              ref={layerRef}
              onPointerDown={beginCreate}
              onPointerMove={onMove}
              onPointerUp={onUp}
              className="absolute inset-y-0 right-0 left-14 touch-none select-none"
            >
              {data.map((event) => {
                const isDragging = drag?.id === event.id && drag.mode !== "create";
                const startMin = isDragging ? drag!.start : toMinutes(event.start);
                const endMin = isDragging ? drag!.end : toMinutes(event.end);
                const top = y(startMin);
                const height = Math.max(y(endMin) - top, 22);
                const style = kindStyle[event.kind];
                return (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${event.title}, ${clockLabel(event.start)} to ${clockLabel(event.end)}`}
                    onPointerDown={(e) => beginOnEvent(e, event, "move")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openEditor(event.id);
                      }
                    }}
                    className={cn(
                      "group absolute right-0 left-2 cursor-grab overflow-hidden rounded-lg border border-border/50 border-l-2 px-3 py-1.5 outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing",
                      style.block,
                      isDragging && "z-20 shadow-lg",
                    )}
                    style={{ top, height }}
                  >
                    {/* Resize handles */}
                    <span
                      onPointerDown={(e) => beginOnEvent(e, event, "resize-start")}
                      className="absolute inset-x-0 top-0 h-1.5 cursor-ns-resize"
                      aria-hidden
                    />
                    <span
                      onPointerDown={(e) => beginOnEvent(e, event, "resize-end")}
                      className="absolute inset-x-0 bottom-0 h-1.5 cursor-ns-resize"
                      aria-hidden
                    />
                    <p className="pointer-events-none truncate text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="tabular pointer-events-none text-xs text-muted-foreground">
                      {hhmm(startMin)}–{hhmm(endMin)}
                    </p>
                  </div>
                );
              })}

              {/* Create ghost */}
              {drag?.mode === "create" && (
                <div
                  className="pointer-events-none absolute right-0 left-2 z-20 rounded-lg border-2 border-dashed border-primary/60 bg-primary/10 px-3 py-1"
                  style={{
                    top: y(drag.start),
                    height: Math.max(y(drag.end) - y(drag.start), 22),
                  }}
                >
                  <p className="tabular text-xs font-medium text-primary">
                    {hhmm(drag.start)}–{hhmm(drag.end)}
                  </p>
                </div>
              )}

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

      <EventEditor
        event={editingEvent}
        open={editorOpen}
        onOpenChange={setEditorOpen}
      />
    </>
  );
}
