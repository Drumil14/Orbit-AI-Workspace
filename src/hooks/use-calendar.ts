"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getSchedule, simulateLatency } from "@/lib/data/queries";
import {
  addCreatedEvent,
  deleteEvent,
  setEventOverride,
} from "@/lib/data/schedule-store";
import type { ScheduleEvent, ScheduleKind } from "@/types";

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

const sortByStart = (events: ScheduleEvent[]) =>
  [...events].sort((a, b) => a.start.localeCompare(b.start));

export interface CreateEventInput {
  title: string;
  start: string;
  end: string;
  kind: ScheduleKind;
}

/** Create an event (used by drag-to-create and the "New event" button). */
export function useCreateEvent() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const event: ScheduleEvent = {
        id: `e_${crypto.randomUUID().slice(0, 8)}`,
        ...input,
      };
      return event;
    },
    onSuccess: (event) => {
      addCreatedEvent(event);
      client.setQueryData<ScheduleEvent[]>(queryKeys.schedule, (old) =>
        old ? sortByStart([...old, event]) : old,
      );
    },
  });
}

/** Apply an edit (time from drag/resize, or title/kind) — optimistic + persisted. */
export function useUpdateEvent() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; patch: Partial<ScheduleEvent> }) =>
      input,
    onMutate: ({ id, patch }) => {
      client.setQueryData<ScheduleEvent[]>(queryKeys.schedule, (old) =>
        old
          ? sortByStart(old.map((e) => (e.id === id ? { ...e, ...patch } : e)))
          : old,
      );
      setEventOverride(id, patch);
    },
  });
}

export function useDeleteEvent() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => id,
    onMutate: (id) => {
      client.setQueryData<ScheduleEvent[]>(queryKeys.schedule, (old) =>
        old?.filter((e) => e.id !== id),
      );
      deleteEvent(id);
    },
  });
}
