"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Columns3, LayoutList, ListChecks, TriangleAlert } from "lucide-react";
import { Card, CardContent } from "@/components/common/card";
import { EmptyState } from "@/components/common/empty-state";
import { FilterChip } from "@/components/common/filter-chip";
import { Mark } from "@/components/common/mark";
import { TaskRow } from "@/components/projects/detail/task-row";
import { TasksSummary } from "@/components/tasks/tasks-summary";
import { TasksKanban } from "@/components/tasks/tasks-kanban";
import { useTaskActions } from "@/components/tasks/task-actions-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks, useToggleTask } from "@/hooks/use-tasks";
import { currentUser } from "@/lib/data/seed";
import { buildTaskDigest } from "@/lib/insights";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AccentHue, TaskWithProject } from "@/types";

type Assignee = "mine" | "all";
type Status = "active" | "all" | "done";
type View = "list" | "board";

interface ProjectGroup {
  slug: string;
  name: string;
  hue: AccentHue;
  tasks: TaskWithProject[];
}

/** Bucket tasks under their project, preserving first-seen (seed) order. */
function groupByProject(tasks: TaskWithProject[]): ProjectGroup[] {
  const groups = new Map<string, ProjectGroup>();
  for (const task of tasks) {
    const group = groups.get(task.projectId) ?? {
      slug: task.projectSlug,
      name: task.projectName,
      hue: task.projectHue,
      tasks: [],
    };
    group.tasks.push(task);
    groups.set(task.projectId, group);
  }
  return [...groups.values()];
}

export function TasksBoard() {
  const { data, isPending, isError, refetch } = useTasks();
  const toggle = useToggleTask();
  const { openTask } = useTaskActions();
  const [assignee, setAssignee] = useState<Assignee>("mine");
  const [status, setStatus] = useState<Status>("active");
  const [view, setView] = useState<View>("list");

  // Board columns are statuses, so the board only respects the assignee filter.
  const assigneeFiltered = useMemo(
    () =>
      (data ?? []).filter(
        (task) => assignee !== "mine" || task.assigneeId === currentUser.id,
      ),
    [data, assignee],
  );

  const visible = useMemo(
    () =>
      assigneeFiltered.filter((task) => {
        if (status === "active" && task.status === "done") return false;
        if (status === "done" && task.status !== "done") return false;
        return true;
      }),
    [assigneeFiltered, status],
  );
  const groups = useMemo(() => groupByProject(visible), [visible]);
  const digest = useMemo(
    () => (data ? buildTaskDigest(data, currentUser.id) : null),
    [data],
  );

  return (
    <div className="space-y-6">
      {isPending ? (
        <Skeleton className="h-[104px] rounded-2xl sm:h-[92px]" />
      ) : digest ? (
        <TasksSummary digest={digest} />
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={assignee === "mine"} onClick={() => setAssignee("mine")}>
          Assigned to me
        </FilterChip>
        <FilterChip active={assignee === "all"} onClick={() => setAssignee("all")}>
          Everyone
        </FilterChip>
        {view === "list" && (
          <>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            {(["active", "all", "done"] as const).map((value) => (
              <FilterChip
                key={value}
                active={status === value}
                onClick={() => setStatus(value)}
              >
                <span className="capitalize">{value}</span>
              </FilterChip>
            ))}
          </>
        )}

        {/* View switch — list of grouped cards, or a drag-and-drop status board. */}
        <div className="ml-auto flex gap-0.5 rounded-lg bg-muted p-0.5">
          {(
            [
              { value: "list", label: "List", icon: LayoutList },
              { value: "board", label: "Board", icon: Columns3 },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              aria-pressed={view === value}
              aria-label={`${label} view`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                view === value
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <Card key={i} className="space-y-3 p-5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load tasks"
          description="Something went wrong reaching the workspace."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : view === "board" ? (
        <TasksKanban tasks={assigneeFiltered} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={status === "done" ? "Nothing finished yet" : "You're all clear"}
          description={
            assignee === "mine"
              ? "No tasks assigned to you match this filter."
              : "No tasks match this filter."
          }
        />
      ) : (
        <motion.div
          variants={staggerChildren(0.06)}
          initial="hidden"
          animate="show"
          className="gap-4 space-y-4 lg:columns-2 lg:space-y-0 2xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid"
        >
          {groups.map((group) => (
            <motion.div key={group.slug} variants={fadeInUp}>
            <Card>
              <div className="flex items-center justify-between px-5 pt-4 pb-1.5">
                <Link
                  href={`/projects/${group.slug}`}
                  className="group flex items-center gap-2.5 rounded outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Mark seed={group.name} hue={group.hue} size="sm" />
                  <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {group.name}
                  </span>
                </Link>
                <span className="tabular text-xs text-muted-foreground">
                  {group.tasks.length}
                </span>
              </div>
              <CardContent className="px-3 pt-0 pb-3">
                <ul>
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggle.mutate(task.id)}
                      onOpen={() => openTask(task)}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
