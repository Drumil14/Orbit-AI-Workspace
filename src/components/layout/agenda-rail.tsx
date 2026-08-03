"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { transition } from "@/lib/motion";
import type { ActivityItem, ScheduleEvent } from "@/types";
import { AgendaActivity } from "./agenda-activity";
import { AgendaSchedule } from "./agenda-schedule";
import { useShell } from "./shell-provider";

const AGENDA_WIDTH = 312;

interface AgendaRailProps {
  schedule: ScheduleEvent[];
  activity: ActivityItem[];
}

/**
 * The persistent right rail — the shell's "instrument panel". Present at xl+
 * and toggled with ⌘J; it animates its width so content reflows smoothly.
 */
export function AgendaRail({ schedule, activity }: AgendaRailProps) {
  const { agendaOpen } = useShell();

  return (
    <AnimatePresence initial={false}>
      {agendaOpen && (
        <motion.aside
          key="agenda"
          aria-label="Agenda"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: AGENDA_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={transition.sidebar}
          className="ambient-panel sticky top-[var(--spine-h)] hidden h-[calc(100dvh-var(--spine-h))] shrink-0 overflow-hidden border-l border-sidebar-border xl:block"
        >
          <div
            style={{ width: AGENDA_WIDTH }}
            className="flex h-full flex-col"
          >
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-5 p-4">
                <AgendaSchedule events={schedule} />
                <Separator />
                <AgendaActivity items={activity} />
              </div>
            </ScrollArea>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
