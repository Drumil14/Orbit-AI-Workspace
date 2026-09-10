"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { DocumentWithProject } from "@/types";
import { CreateDocumentDialog } from "./create-document-dialog";
import { DocViewerSheet } from "./doc-viewer-sheet";

interface DocActionsValue {
  /** Open the viewer/editor drawer for a document. */
  openDoc: (doc: DocumentWithProject) => void;
  /** Open the create-document dialog, optionally pre-selecting a project. */
  openCreateDoc: (defaultProjectSlug?: string) => void;
}

const DocActionsContext = createContext<DocActionsValue | null>(null);

/**
 * Hosts the document viewer and create dialog once for the whole workspace, and
 * exposes imperative openers via context — so any doc card or button can open a
 * consistent viewer/create flow.
 */
export function DocActionsProvider({ children }: { children: React.ReactNode }) {
  const [doc, setDoc] = useState<DocumentWithProject | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDefault, setCreateDefault] = useState<string | undefined>();
  const [createKey, setCreateKey] = useState(0);

  const openDoc = useCallback((next: DocumentWithProject) => {
    setDoc(next);
    setViewOpen(true);
  }, []);

  const openCreateDoc = useCallback((defaultProjectSlug?: string) => {
    setCreateDefault(defaultProjectSlug);
    setCreateKey((k) => k + 1);
    setCreateOpen(true);
  }, []);

  const value = useMemo(
    () => ({ openDoc, openCreateDoc }),
    [openDoc, openCreateDoc],
  );

  return (
    <DocActionsContext.Provider value={value}>
      {children}
      <DocViewerSheet doc={doc} open={viewOpen} onOpenChange={setViewOpen} />
      <CreateDocumentDialog
        key={createKey}
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultProjectSlug={createDefault}
      />
    </DocActionsContext.Provider>
  );
}

export function useDocActions(): DocActionsValue {
  const ctx = useContext(DocActionsContext);
  if (!ctx) {
    throw new Error("useDocActions must be used within a DocActionsProvider");
  }
  return ctx;
}
