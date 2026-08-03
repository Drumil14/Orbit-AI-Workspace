"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getTasks, simulateLatency } from "@/lib/data/queries";
import type { TaskWithProject } from "@/types";

/**
 * Cross-project task hooks. Same seam as the rest of the app — latency lives in
 * the hook so skeletons are exercised, and the getters swap for FastAPI later.
 */

export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: async () => {
      await simulateLatency(500);
      return getTasks();
    },
  });
}

function toggled(task: TaskWithProject): TaskWithProject {
  return { ...task, status: task.status === "done" ? "todo" : "done" };
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
      client.setQueryData<TaskWithProject[]>(key, (old) =>
        old?.map((t) => (t.id === taskId ? toggled(t) : t)),
      );
      return { previous };
    },
    onError: (_err, _taskId, ctx) => {
      if (ctx?.previous) client.setQueryData(key, ctx.previous);
    },
  });
}
