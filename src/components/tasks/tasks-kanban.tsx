"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mark } from "@/components/common/mark";
import { StatusDot } from "@/components/common/status-dot";
import { UserAvatar } from "@/components/common/user-avatar";
import { useTaskActions } from "@/components/tasks/task-actions-provider";
import { useUpdateTask } from "@/hooks/use-tasks";
import { getPerson } from "@/lib/data/people";
import { priorityMeta } from "@/lib/project-meta";
import { taskStatusMeta, taskStatusOrder } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { TaskStatus, TaskWithProject } from "@/types";

/**
 * A status board: one column per task status, with cards you drag between them
 * to change status. The move writes through the shared task mutation, so it
 * persists and is reflected in every other view. Cards stay clickable (and
 * keyboard-focusable) to open the detail drawer, which offers a non-drag path
 * to change status.
 */
function TaskCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: {
  task: TaskWithProject;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onOpen: () => void;
}) {
  const assignee = getPerson(task.assigneeId);
  const priority = priorityMeta[task.priority];

  return (
    <motion.div layout="position" transition={{ duration: 0.18 }}>
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        role="button"
        tabIndex={0}
        aria-roledescription="Draggable task card"
        className={cn(
          "group cursor-grab rounded-xl border border-border/70 bg-card p-3 shadow-xs transition-[box-shadow,border-color,opacity] outline-none hover:border-border hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 active:cursor-grabbing",
          dragging && "opacity-40",
        )}
      >
        <div className="mb-2 flex items-center gap-1.5">
          <Mark seed={task.projectName} hue={task.projectHue} size="sm" />
          <span className="truncate text-xs text-muted-foreground">
            {task.projectName}
          </span>
        </div>
        <p className="text-sm text-foreground">{task.title}</p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <StatusDot tone={priority.tone} label={`${priority.label} priority`} />
            {task.due && (
              <span className="tabular text-xs text-muted-foreground">
                {task.due}
              </span>
            )}
          </span>
          {assignee ? (
            <UserAvatar user={assignee} size="sm" />
          ) : (
            <span className="size-6" aria-hidden />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function TasksKanban({ tasks }: { tasks: TaskWithProject[] }) {
  const update = useUpdateTask();
  const { openTask } = useTaskActions();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null);

  const byStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const drop = (status: TaskStatus) => {
    const task = tasks.find((t) => t.id === draggingId);
    setOverStatus(null);
    setDraggingId(null);
    if (task && task.status !== status) {
      update.mutate({ id: task.id, projectSlug: task.projectSlug, patch: { status } });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {taskStatusOrder.map((status) => {
        const meta = taskStatusMeta[status];
        const columnTasks = byStatus(status);
        const isOver = overStatus === status;
        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (overStatus !== status) setOverStatus(status);
            }}
            onDrop={() => drop(status)}
            aria-label={`${meta.label} column`}
            className={cn(
              "flex flex-col rounded-2xl border p-2.5 transition-colors",
              isOver
                ? "border-primary/40 bg-primary/[0.04]"
                : "border-border/60 bg-muted/30",
            )}
          >
            <div className="flex items-center gap-2 px-1.5 py-1.5">
              <StatusDot tone={meta.tone} />
              <span className="text-sm font-semibold text-foreground">
                {meta.label}
              </span>
              <span className="tabular ml-auto text-xs text-muted-foreground">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex min-h-24 flex-1 flex-col gap-2 p-1">
              {columnTasks.length === 0 ? (
                <div
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-center text-xs transition-colors",
                    isOver
                      ? "border-primary/40 text-primary"
                      : "border-border/60 text-muted-foreground/60",
                  )}
                >
                  {isOver ? "Drop here" : "Nothing here"}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    dragging={draggingId === task.id}
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverStatus(null);
                    }}
                    onOpen={() => openTask(task)}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
