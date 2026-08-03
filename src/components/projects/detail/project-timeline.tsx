"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Flag,
  History,
  MessageSquare,
  Paperclip,
  Plus,
  Rocket,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { UserAvatar } from "@/components/common/user-avatar";
import { getPerson } from "@/lib/data/people";
import { relativeTime } from "@/lib/format";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { TimelineEvent, TimelineKind } from "@/types";

/** Marker glyph + tint per event kind — colored, calm, never neon. */
const kindMeta: Record<TimelineKind, { icon: LucideIcon; className: string }> = {
  created: { icon: Plus, className: "bg-muted text-muted-foreground" },
  shipped: { icon: Rocket, className: "bg-success/15 text-success" },
  milestone: { icon: Flag, className: "bg-primary/12 text-primary" },
  status: { icon: Activity, className: "bg-info/15 text-info" },
  comment: { icon: MessageSquare, className: "bg-muted text-muted-foreground" },
  upload: { icon: Paperclip, className: "bg-muted text-muted-foreground" },
  ai: { icon: Sparkles, className: "bg-primary/12 text-primary" },
};

function TimelineRow({ event, last }: { event: TimelineEvent; last: boolean }) {
  const meta = kindMeta[event.kind];
  const Icon = meta.icon;
  const actor = getPerson(event.actorId);

  return (
    <motion.li
      variants={fadeInUp}
      className="relative flex gap-3 pb-4 last:pb-0"
    >
      {!last && (
        <span
          aria-hidden
          className="absolute top-6 bottom-0 left-[11px] w-px bg-border"
        />
      )}
      <span
        className={cn(
          "relative z-10 grid size-6 shrink-0 place-items-center rounded-full",
          meta.className,
        )}
      >
        <Icon className="size-3" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{event.title}</p>
        {event.detail && (
          <p className="text-xs text-muted-foreground">{event.detail}</p>
        )}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          {actor && <UserAvatar user={actor} size="sm" />}
          {actor && <span>{actor.name}</span>}
          {actor && <span aria-hidden>·</span>}
          <span>{relativeTime(event.at)}</span>
        </div>
      </div>
    </motion.li>
  );
}

export function ProjectTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="size-4 text-muted-foreground" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <motion.ol
          variants={staggerChildren(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {events.map((event, i) => (
            <TimelineRow
              key={event.id}
              event={event}
              last={i === events.length - 1}
            />
          ))}
        </motion.ol>
      </CardContent>
    </Card>
  );
}
