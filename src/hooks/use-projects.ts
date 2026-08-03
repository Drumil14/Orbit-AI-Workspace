"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import {
  getProjectDetail,
  getProjects,
  simulateLatency,
} from "@/lib/data/queries";
import type { ProjectDetail, Task } from "@/types";

/**
 * Projects data hooks.
 *
 * Latency is simulated in the hook so loading skeletons are exercised in dev;
 * the getters stay pure so swapping them for FastAPI later touches one file.
 */

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () => {
      await simulateLatency(500);
      return getProjects();
    },
  });
}

export function useProjectDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.projectDetail(slug),
    queryFn: async () => {
      await simulateLatency(600);
      const detail = await getProjectDetail(slug);
      if (!detail) throw new Error(`Project "${slug}" not found`);
      return detail;
    },
  });
}

function toggled(task: Task): Task {
  return { ...task, status: task.status === "done" ? "todo" : "done" };
}

/**
 * Optimistically check/uncheck a task. Flips the cached detail immediately and
 * rolls back if the (simulated) request fails — the checklist never stalls.
 */
export function useToggleTask(slug: string) {
  const client = useQueryClient();
  const key = queryKeys.projectDetail(slug);

  return useMutation({
    mutationFn: async (taskId: string) => {
      await simulateLatency(300);
      return taskId;
    },
    onMutate: async (taskId: string) => {
      await client.cancelQueries({ queryKey: key });
      const previous = client.getQueryData<ProjectDetail>(key);
      client.setQueryData<ProjectDetail>(key, (old) =>
        old
          ? { ...old, tasks: old.tasks.map((t) => (t.id === taskId ? toggled(t) : t)) }
          : old,
      );
      return { previous };
    },
    onError: (_err, _taskId, ctx) => {
      if (ctx?.previous) client.setQueryData(key, ctx.previous);
    },
  });
}
