"use client";

import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeleteEvent, useUpdateEvent } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";
import type { ScheduleEvent, ScheduleKind } from "@/types";

const kinds: { value: ScheduleKind; label: string; dot: string }[] = [
  { value: "meeting", label: "Meeting", dot: "bg-indigo-500" },
  { value: "focus", label: "Focus", dot: "bg-emerald-500" },
  { value: "review", label: "Review", dot: "bg-amber-500" },
  { value: "personal", label: "Personal", dot: "bg-slate-400" },
];

function clockLabel(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h! < 12 ? "AM" : "PM"}`;
}

/** Edit an event's title and kind (times are set by dragging), or delete it. */
function EditorBody({
  event,
  onClose,
}: {
  event: ScheduleEvent;
  onClose: () => void;
}) {
  const update = useUpdateEvent();
  const remove = useDeleteEvent();
  const [title, setTitle] = useState(event.title);

  const commitTitle = () => {
    const next = title.trim();
    if (next && next !== event.title) {
      update.mutate({ id: event.id, patch: { title: next } });
    } else if (!next) {
      setTitle(event.title);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit event</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="event-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            autoFocus
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-sm font-medium">Type</span>
          <div className="flex flex-wrap gap-1.5">
            {kinds.map((k) => {
              const active = event.kind === k.value;
              return (
                <button
                  key={k.value}
                  type="button"
                  onClick={() =>
                    !active &&
                    update.mutate({ id: event.id, patch: { kind: k.value } })
                  }
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "border-border bg-card text-foreground shadow-xs"
                      : "border-transparent bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className={cn("size-2 rounded-full", k.dot)} />
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <Clock className="size-3.5" />
          {clockLabel(event.start)} – {clockLabel(event.end)}
          <span className="ml-auto text-xs">Drag on the grid to reschedule</span>
        </div>
      </div>

      <DialogFooter className="justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => {
            remove.mutate(event.id);
            onClose();
          }}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
        <Button
          size="sm"
          onClick={() => {
            commitTitle();
            onClose();
          }}
        >
          Done
        </Button>
      </DialogFooter>
    </>
  );
}

export function EventEditor({
  event,
  open,
  onOpenChange,
}: {
  event: ScheduleEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        {event && (
          <EditorBody
            key={event.id}
            event={event}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
