"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getSchedule, simulateLatency } from "@/lib/data/queries";

/** Today's schedule for the Calendar screen. */
export function useSchedule() {
  return useQuery({
    queryKey: queryKeys.schedule,
    queryFn: async () => {
      await simulateLatency(400);
      return getSchedule();
    },
  });
}
