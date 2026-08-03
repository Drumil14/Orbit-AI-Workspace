"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getDocuments, simulateLatency } from "@/lib/data/queries";

/** Cross-project documents library. Same seam as the rest of the app. */
export function useDocuments() {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: async () => {
      await simulateLatency(500);
      return getDocuments();
    },
  });
}
