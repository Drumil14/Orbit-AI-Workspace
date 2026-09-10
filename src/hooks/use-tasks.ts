"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getTasks, simulateLatency } from "@/lib/data/queries";
import { currentUser } from "@/lib/data/seed";
import { addCreatedTask, deleteTask, setTaskOverride } from "@/lib/data/task-store";
import { recordNotification } from "@/lib/data/notifications-store";
import type {
  AccentHue,
  ProjectDetail,
  Task,
  TaskWithProject,
} from "@/types";

/**
 * Cross-project task hooks. Same seam as the rest of the app — latency lives in
 * the hook so skeletons are exercised, and the getters swap for FastAPI later.
 *
 * Mutations write through the session task store *and* patch every cache that
 * holds the task (the cross-project list and the owning project's detail), so a
 * change made in one view is reflected everywhere, immediately, without a
 * refetch.
 */

export function useTasks(enabled = true) {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: async () => {
      await simulateLatency(500);
      return getTasks();
    },
    enabled,
  });
}

/** Patch the matching task in the owning project's detail cache, if present. */
function patchProjectDetail(
  client: QueryClient,
  projectSlug: string,
  taskId: string,
  patch: Partial<Task>,
) {
  const key = queryKeys.projectDetail(projectSlug);
  client.setQueryData<ProjectDetail>(key, (old) =>
    old
      ? {
          ...old,
          tasks: old.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t)),
        }
      : old,
  );
}

/**
 * Apply a partial edit to a task (status, description, title, …). Records the
 * override in the store so it survives a client-side refetch, and patches both
 * caches so open views update instantly.
 */
export function useUpdateTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      projectSlug: string;
      patch: Partial<Task>;
    }) => {
      await simulateLatency(250);
      return input;
    },
    onMutate: async ({ id, projectSlug, patch }) => {
      await client.cancelQueries({ queryKey: queryKeys.tasks });
      const previous = client.getQueryData<TaskWithProject[]>(queryKeys.tasks);
      const target = previous?.find((t) => t.id === id);
      client.setQueryData<TaskWithProject[]>(queryKeys.tasks, (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      );
      patchProjectDetail(client, projectSlug, id, patch);
      setTaskOverride(id, patch);
      if (patch.status === "done" && target && target.status !== "done") {
        recordNotification(`You completed “${target.title}”`);
      }
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) client.setQueryData(queryKeys.tasks, ctx.previous);
    },
  });
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  project: { id: string; name: string; slug: string; hue: AccentHue };
  assigneeId?: string;
  priority?: Task["priority"];
  status?: Task["status"];
  due?: string;
}

/** Create a task, add it to the session store, and surface it in every cache. */
export function useCreateTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      await simulateLatency(300);
      const task: TaskWithProject = {
        id: `t_${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        description: input.description?.trim() || undefined,
        status: input.status ?? "todo",
        priority: input.priority ?? "medium",
        // Quick-created tasks land on the creator's plate by default so they're
        // visible in the default "Assigned to me" view right away.
        assigneeId: input.assigneeId ?? currentUser.id,
        due: input.due,
        group: "This week",
        projectId: input.project.id,
        projectName: input.project.name,
        projectSlug: input.project.slug,
        projectHue: input.project.hue,
      };
      return task;
    },
    onSuccess: (task) => {
      addCreatedTask(task);
      recordNotification(`You added “${task.title}” to ${task.projectName}`);
      client.setQueryData<TaskWithProject[]>(queryKeys.tasks, (old) =>
        old ? [task, ...old] : old,
      );
      const base: Task = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        due: task.due,
        group: task.group,
      };
      client.setQueryData<ProjectDetail>(
        queryKeys.projectDetail(task.projectSlug),
        (old) => (old ? { ...old, tasks: [base, ...old.tasks] } : old),
      );
    },
  });
}

/** Delete a task (created outright, seed tombstoned) and drop it from caches. */
export function useDeleteTask() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; projectSlug: string }) => {
      await simulateLatency(250);
      return input;
    },
    onMutate: ({ id, projectSlug }) => {
      client.setQueryData<TaskWithProject[]>(queryKeys.tasks, (old) =>
        old?.filter((t) => t.id !== id),
      );
      client.setQueryData<ProjectDetail>(
        queryKeys.projectDetail(projectSlug),
        (old) =>
          old ? { ...old, tasks: old.tasks.filter((t) => t.id !== id) } : old,
      );
      deleteTask(id);
    },
  });
}

function toggled(status: Task["status"]): Task["status"] {
  return status === "done" ? "todo" : "done";
}

/** Optimistically check/uncheck a task in the aggregated list. */
export function useToggleTask() {
  const client = useQueryClient();
  const key = queryKeys.tasks;

  return useMutation({
    mutationFn: async (taskId: string) => {
      await simulateLatency(300);
      return taskId;
    },
    onMutate: async (taskId: string) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<TaskWithProject[]>(key);
      const target = previous?.find((t) => t.id === taskId);
      if (target) {
        const status = toggled(target.status);
        client.setQueryData<TaskWithProject[]>(key, (old) =>
          old?.map((t) => (t.id === taskId ? { ...t, status } : t)),
        );
        patchProjectDetail(client, target.projectSlug, taskId, { status });
        setTaskOverride(taskId, { status });
        if (status === "done") {
          recordNotification(`You completed “${target.title}”`);
        }
      }
      return { previous };
    },
    onError: (_err, _taskId, ctx) => {
      if (ctx?.previous) client.setQueryData(key, ctx.previous);
    },
  });
}
