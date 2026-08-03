"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { StatusDot } from "@/components/common/status-dot";
import { UserAvatar } from "@/components/common/user-avatar";
import { getPerson } from "@/lib/data/people";
import { priorityMeta } from "@/lib/project-meta";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

/** Sub-label for in-flight states; done/todo are conveyed by the checkbox. */
const stateLabel: Partial<Record<TaskStatus, string>> = {
  in_progress: "In progress",
  in_review: "In review",
};

export function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const isDone = task.status === "done";
  const assignee = getPerson(task.assigneeId);
  const priority = priorityMeta[task.priority];
  const state = stateLabel[task.status];

  return (
    <li className="group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-accent/70">
      {/* Accent rule that grows in on hover — the row's interactive tell. */}
      <span
        aria-hidden
        className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100"
      />

      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isDone}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
        whileTap={{ scale: 0.86 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-transparent group-hover:border-muted-foreground",
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: isDone ? 1 : 0.4, opacity: isDone ? 1 : 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <Check className="size-3" strokeWidth={2.5} />
        </motion.span>
      </motion.button>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm text-foreground",
            isDone && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
        {state && !isDone && (
          <span className="block text-xs text-muted-foreground">{state}</span>
        )}
      </span>

      <span className="flex shrink-0 items-center gap-2.5">
        {task.due && (
          <span className="tabular text-xs text-muted-foreground">{task.due}</span>
        )}
        <StatusDot tone={priority.tone} label={`${priority.label} priority`} />
        {assignee ? (
          <UserAvatar user={assignee} size="sm" />
        ) : (
          <span className="size-6" aria-hidden />
        )}
      </span>
    </li>
  );
}
