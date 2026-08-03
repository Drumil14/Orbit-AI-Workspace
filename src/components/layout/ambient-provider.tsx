"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AccentHue } from "@/types";

interface AmbientContextValue {
  /** A page's claimed hue, or null to fall back to the active workspace. */
  override: AccentHue | null;
  setOverride: (hue: AccentHue | null) => void;
}

const AmbientContext = createContext<AmbientContextValue | null>(null);

/**
 * Lets a single screen temporarily claim the whole-app atmosphere. Because
 * `--ambient` is a registered @property, swapping the hue makes the entire
 * shell cross-fade — so entering a project *feels* like stepping into its room,
 * and leaving fades back to the workspace's own hue.
 */
export function AmbientProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<AccentHue | null>(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return (
    <AmbientContext.Provider value={value}>{children}</AmbientContext.Provider>
  );
}

export function useAmbientContext(): AmbientContextValue {
  const context = useContext(AmbientContext);
  if (!context) {
    throw new Error("useAmbientContext must be used within an AmbientProvider");
  }
  return context;
}

/** Claim the ambient hue for as long as the calling component is mounted. */
export function useAmbientHue(hue: AccentHue | undefined) {
  const { setOverride } = useAmbientContext();
  useEffect(() => {
    if (!hue) return;
    setOverride(hue);
    return () => setOverride(null);
  }, [hue, setOverride]);
}
