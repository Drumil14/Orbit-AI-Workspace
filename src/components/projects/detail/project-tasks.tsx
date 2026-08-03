"use client";

import { useMemo, useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { ProgressBar } from "@/components/common/progress-bar";
import { useToggleTask } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskRow } from "./task-row";

type TaskFilter = "all" | "active" | "done";
const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

/** Group tasks by their bucket, preserving the authored group order. */
function groupTasks(tasks: Task[]): [string, Task[]][] {
  const groups = new Map<string, Task[]>();
  for (const task of tasks) {
    const bucket = groups.get(task.group) ?? [];
    bucket.push(task);
    groups.set(task.group, bucket);
  }
  return [...groups.entries()];
}

/**
 * The project's primary work surface — deliberately the densest, tallest panel
 * on the page. Grouped rows, an inline completion meter, filters, and a quiet
 * add affordance, so it reads as the thing you live in rather than one more
 * card in a stack.
 */
export function ProjectTasks({ slug, tasks }: { slug: string; tasks: Task[] }) {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const toggle = useToggleTask(slug);
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? (doneCount / tasks.length) * 100 : 0;

  const visible = useMemo(
    () =>
      tasks.filter((t) =>
        filter === "all"
          ? true
          : filter === "done"
            ? t.status === "done"
            : t.status !== "done",
      ),
    [tasks, filter],
  );
  const groups = useMemo(() => groupTasks(visible), [visible]);

  return (
    <Card className="flex min-h-[26rem] flex-col shadow-sm">
      <CardHeader className="flex-col items-stretch gap-4 pb-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
            <ListChecks className="size-4" />
          </span>
          <div className="min-w-0">
            <CardTitle>Tasks</CardTitle>
            <div className="mt-1 flex items-center gap-2.5">
              <span className="tabular text-xs text-muted-foreground">
                {doneCount} of {tasks.length} done
              </span>
              <ProgressBar value={pct} className="h-1 w-24" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg bg-muted p-0.5">
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={cn(
                  "rounded-[7px] px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  filter === option.value
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => toast("New task")}
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground shadow-xs transition-all duration-150 outline-none hover:border-border hover:text-foreground active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="Add task"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6 pt-1">
        {groups.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Nothing here"
            description="No tasks match this filter."
          />
        ) : (
          groups.map(([name, items]) => (
            <div key={name}>
              <div className="flex items-center gap-2 px-2 pb-1.5">
                <span className="text-[12px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                  {name}
                </span>
                <span className="tabular text-[12px] text-muted-foreground/50">
                  {items.length}
                </span>
                <span aria-hidden className="h-px flex-1 bg-border/60" />
              </div>
              <ul className="-mx-1">
                {items.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggle.mutate(task.id)}
                  />
                ))}
              </ul>
            </div>
          ))
        )}

        {groups.length > 0 && (
          <button
            type="button"
            onClick={() => toast("New task")}
            className="group -mx-1 flex w-[calc(100%+0.5rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 outline-none hover:bg-accent/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="grid size-[18px] place-items-center rounded-full border border-dashed border-border text-muted-foreground transition-colors group-hover:border-muted-foreground">
              <Plus className="size-3" />
            </span>
            Add task
          </button>
        )}
      </CardContent>
    </Card>
  );
}
