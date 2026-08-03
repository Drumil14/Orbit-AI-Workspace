"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Workspace } from "@/types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  active: Workspace;
  setActiveId: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

/**
 * Holds the active workspace on the client so switching instantly re-tints the
 * atmosphere and updates the breadcrumb. The initial value is chosen on the
 * server; the data seam is untouched.
 */
export function WorkspaceProvider({
  workspaces,
  initialActiveId,
  children,
}: {
  workspaces: Workspace[];
  initialActiveId: string;
  children: React.ReactNode;
}) {
  const [activeId, setActiveId] = useState(initialActiveId);
  const active = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeId) ?? workspaces[0],
    [workspaces, activeId],
  );

  const value = useMemo(
    () => ({ workspaces, active, setActiveId }),
    [workspaces, active],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
