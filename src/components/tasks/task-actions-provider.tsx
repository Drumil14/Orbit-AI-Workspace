"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { TaskWithProject } from "@/types";
import { QuickCreateDialog } from "./quick-create-dialog";
import { TaskDetailSheet } from "./task-detail-sheet";

interface TaskActionsValue {
  /** Open the detail drawer for a task (from any list). */
  openTask: (task: TaskWithProject) => void;
  /** Open Quick Create, optionally pre-selecting a project. */
  openCreate: (defaultProjectSlug?: string) => void;
}

const TaskActionsContext = createContext<TaskActionsValue | null>(null);

/**
 * Hosts the two shared task surfaces — the detail drawer and Quick Create — once
 * for the whole workspace, and exposes imperative openers via context. Any list
 * row or button can trigger a consistent detail view or create flow without
 * wiring its own dialog.
 */
export function TaskActionsProvider({ children }: { children: React.ReactNode }) {
  // The snapshot seeds the drawer; it reads live task data from the cache by id.
  // It's kept (never nulled) so the drawer's exit animation isn't cut short.
  const [detailTask, setDetailTask] = useState<TaskWithProject | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDefault, setCreateDefault] = useState<string | undefined>();
  // Bumped on each open so the surfaces remount with fresh internal state,
  // avoiding "reset on open" effects.
  const [createKey, setCreateKey] = useState(0);

  const openTask = useCallback((task: TaskWithProject) => {
    setDetailTask(task);
    setDetailOpen(true);
  }, []);

  const openCreate = useCallback((defaultProjectSlug?: string) => {
    setCreateDefault(defaultProjectSlug);
    setCreateKey((k) => k + 1);
    setCreateOpen(true);
  }, []);

  const value = useMemo(() => ({ openTask, openCreate }), [openTask, openCreate]);

  return (
    <TaskActionsContext.Provider value={value}>
      {children}
      <TaskDetailSheet
        task={detailTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <QuickCreateDialog
        key={createKey}
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultProjectSlug={createDefault}
      />
    </TaskActionsContext.Provider>
  );
}

export function useTaskActions(): TaskActionsValue {
  const ctx = useContext(TaskActionsContext);
  if (!ctx) {
    throw new Error("useTaskActions must be used within a TaskActionsProvider");
  }
  return ctx;
}
