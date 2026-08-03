/**
 * A tiny localStorage-backed boolean, exposed as a `useSyncExternalStore`
 * source. The server snapshot is the default, so SSR is stable; the client
 * reads the real value and stays in sync across tabs via the `storage` event.
 */
export function createPersistedFlag(key: string, defaultValue: boolean) {
  const listeners = new Set<() => void>();

  return {
    subscribe(onChange: () => void) {
      listeners.add(onChange);
      window.addEventListener("storage", onChange);
      return () => {
        listeners.delete(onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    get(): boolean {
      const stored = localStorage.getItem(key);
      return stored === null ? defaultValue : stored === "1";
    },
    getServer(): boolean {
      return defaultValue;
    },
    set(next: boolean) {
      localStorage.setItem(key, next ? "1" : "0");
      listeners.forEach((notify) => notify());
    },
  };
}
