"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { StatusDot } from "@/components/common/status-dot";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusTasks } from "@/hooks/use-home";
import { popTransition, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { StatusTone, TaskPriority } from "@/types";

const priorityTone: Record<TaskPriority, StatusTone> = {
  high: "danger",
  medium: "warning",
  low: "muted",
};

export function TodaysFocusCard() {
  const { data, isPending } = useFocusTasks();
  const [done, setDone] = useState<Record<string, boolean>>({});

  const remaining = data?.filter((task) => !done[task.id]).length ?? 0;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-lg">Today&rsquo;s focus</CardTitle>
          <CardDescription>
            {isPending
              ? "Loading your focus…"
              : remaining === 0
                ? "All clear. Nothing left for today."
                : `${remaining} to move the needle.`}
          </CardDescription>
        </div>
        {!isPending && data && data.length > 0 && (
          <span className="tabular mt-0.5 shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {data.length - remaining}/{data.length}
          </span>
        )}
      </CardHeader>

      <CardContent className="pt-1">
        {isPending || !data ? (
          <ul className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 px-2 py-3">
                <Skeleton className="size-5 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-0.5">
            <AnimatePresence initial={false}>
              {[...data]
                .sort(
                  (a, b) => Number(!!done[a.id]) - Number(!!done[b.id]),
                )
                .map((task) => {
                  const isDone = !!done[task.id];
                  return (
                    <motion.li
                      key={task.id}
                      layout
                      transition={transition.springSoft}
                    >
                      <button
                        type="button"
                        aria-pressed={isDone}
                        onClick={() =>
                          setDone((prev) => ({
                            ...prev,
                            [task.id]: !prev[task.id],
                          }))
                        }
                        className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-accent/70"
                      >
                        <motion.span
                          initial={false}
                          animate={{ scale: isDone ? [1, 1.28, 1] : 1 }}
                          transition={isDone ? popTransition : transition.spring}
                          whileTap={{ scale: 0.82 }}
                          className={cn(
                            "grid size-5 shrink-0 place-items-center rounded-full border transition-colors",
                            isDone
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-transparent group-hover:border-muted-foreground",
                          )}
                        >
                          <Check className="size-3" strokeWidth={2.5} />
                        </motion.span>
                        <span className="min-w-0 flex-1">
                          <span className="relative inline-block max-w-full truncate align-bottom">
                            <span
                              className={cn(
                                "block truncate text-sm transition-colors duration-300",
                                isDone
                                  ? "text-muted-foreground"
                                  : "text-foreground",
                              )}
                            >
                              {task.title}
                            </span>
                            {/* Strike that draws across the label on completion. */}
                            <motion.span
                              aria-hidden
                              initial={false}
                              animate={{ scaleX: isDone ? 1 : 0 }}
                              transition={transition.spring}
                              className="absolute inset-x-0 top-1/2 h-px origin-left bg-muted-foreground/70"
                            />
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {task.projectName}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <StatusDot
                            tone={priorityTone[task.priority]}
                            label={`${task.priority} priority`}
                          />
                          <span className="tabular text-xs text-muted-foreground">
                            {task.due}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
