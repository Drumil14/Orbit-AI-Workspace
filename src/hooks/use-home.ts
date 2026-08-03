"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import {
  getContinueWorking,
  getFocusTasks,
  getHomeBrief,
  getPinnedProjects,
  simulateLatency,
} from "@/lib/data/queries";

/**
 * Home data hooks.
 *
 * Latency is simulated *in the hook* (not the shared getter) so the shell's
 * server-read chrome stays instant while Home exercises real loading states.
 * When the backend lands, only the getters change — these hooks stay put.
 */

export function useContinueWorking() {
  return useQuery({
    queryKey: queryKeys.continueWorking,
    queryFn: async () => {
      await simulateLatency(500);
      return getContinueWorking();
    },
  });
}

export function useFocusTasks() {
  return useQuery({
    queryKey: queryKeys.focusTasks,
    queryFn: async () => {
      await simulateLatency(700);
      return getFocusTasks();
    },
  });
}

export function usePinnedProjects() {
  return useQuery({
    queryKey: queryKeys.pinnedProjects,
    queryFn: async () => {
      await simulateLatency(600);
      return getPinnedProjects();
    },
  });
}

/**
 * The synthesized Home brief. Given a short latency so it lands *first* — the
 * intelligence should be the thing that greets you, not the last card to fill.
 */
export function useHomeBrief() {
  return useQuery({
    queryKey: queryKeys.homeBrief,
    queryFn: async () => {
      await simulateLatency(250);
      return getHomeBrief();
    },
  });
}
