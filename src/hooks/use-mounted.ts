"use client";

import { useSyncExternalStore } from "react";

/** No external source to subscribe to — the value only differs by environment. */
const subscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true.
 *
 * Uses `useSyncExternalStore` (server snapshot vs client snapshot) instead of
 * an effect, so there's no hydration mismatch and no cascading render — the
 * pattern React recommends for "am I on the client yet?" checks.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
