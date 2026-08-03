"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { primaryNav } from "@/lib/navigation";
import { createPersistedFlag } from "@/lib/persisted-flag";

const collapsedFlag = createPersistedFlag("orbit:sidebar-collapsed", false);
const agendaFlag = createPersistedFlag("orbit:agenda-open", true);

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Second letter of each nav shortcut → its route, e.g. { p: "/projects" }. */
const gRoutes: Record<string, string> = Object.fromEntries(
  primaryNav
    .filter((item) => item.shortcut)
    .map((item) => [item.shortcut!.split(" ")[1]!.toLowerCase(), item.href]),
);

interface ShellContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  agendaOpen: boolean;
  toggleAgenda: () => void;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable
  );
}

/**
 * Owns all shell chrome state and the global keyboard model:
 *   ⌘K command menu · ⌘B sidebar · ⌘J agenda · `g` then h/p/t/d/c to navigate.
 */
export function ShellProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const collapsed = useSyncExternalStore(
    collapsedFlag.subscribe,
    collapsedFlag.get,
    collapsedFlag.getServer,
  );
  const agendaOpen = useSyncExternalStore(
    agendaFlag.subscribe,
    agendaFlag.get,
    agendaFlag.getServer,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const toggleCollapsed = useCallback(
    () => collapsedFlag.set(!collapsedFlag.get()),
    [],
  );
  const toggleAgenda = useCallback(() => agendaFlag.set(!agendaFlag.get()), []);

  const gPending = useRef(false);
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      if (mod && key === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }
      if (mod && key === "b") {
        event.preventDefault();
        if (window.matchMedia(DESKTOP_QUERY).matches) toggleCollapsed();
        else setMobileOpen((open) => !open);
        return;
      }
      if (mod && key === "j") {
        event.preventDefault();
        toggleAgenda();
        return;
      }
      if (mod || isTypingTarget(event.target)) return;

      // `g` opens a short window; the next key jumps to that route.
      if (key === "g") {
        gPending.current = true;
        if (gTimer.current) clearTimeout(gTimer.current);
        gTimer.current = setTimeout(() => {
          gPending.current = false;
        }, 800);
        return;
      }
      if (gPending.current && gRoutes[key]) {
        event.preventDefault();
        gPending.current = false;
        if (gTimer.current) clearTimeout(gTimer.current);
        router.push(gRoutes[key]);
      } else {
        gPending.current = false;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, toggleCollapsed, toggleAgenda]);

  return (
    <ShellContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        mobileOpen,
        setMobileOpen,
        agendaOpen,
        toggleAgenda,
        commandOpen,
        setCommandOpen,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
}
