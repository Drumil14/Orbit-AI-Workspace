"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/data/keys";
import { getDocuments, simulateLatency } from "@/lib/data/queries";
import { currentUser } from "@/lib/data/seed";
import {
  addCreatedDoc,
  deleteDoc,
  setDocOverride,
} from "@/lib/data/doc-store";
import { recordNotification } from "@/lib/data/notifications-store";
import type {
  AccentHue,
  DocKind,
  DocumentItem,
  DocumentWithProject,
  ProjectDetail,
} from "@/types";

/**
 * Cross-project documents library. Same seam as the rest of the app; mutations
 * write through the persisted doc store and patch both the library and the
 * owning project's detail caches so views stay in sync without a refetch.
 */
export function useDocuments(enabled = true) {
  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: async () => {
      await simulateLatency(500);
      return getDocuments();
    },
    enabled,
  });
}

/** Patch the matching doc in the owning project's detail cache, if present. */
function patchProjectDocs(
  client: QueryClient,
  projectSlug: string,
  docId: string,
  patch: Partial<DocumentItem>,
) {
  client.setQueryData<ProjectDetail>(
    queryKeys.projectDetail(projectSlug),
    (old) =>
      old
        ? {
            ...old,
            documents: old.documents.map((d) =>
              d.id === docId ? { ...d, ...patch } : d,
            ),
          }
        : old,
  );
}

export function useUpdateDocument() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      id: string;
      projectSlug: string;
      patch: Partial<DocumentItem>;
    }) => {
      await simulateLatency(250);
      return input;
    },
    onMutate: ({ id, projectSlug, patch }) => {
      // Any edit counts as a fresh touch.
      const withTouch = { ...patch, updatedAt: new Date().toISOString() };
      client.setQueryData<DocumentWithProject[]>(queryKeys.documents, (old) =>
        old?.map((d) => (d.id === id ? { ...d, ...withTouch } : d)),
      );
      patchProjectDocs(client, projectSlug, id, withTouch);
      setDocOverride(id, withTouch);
    },
  });
}

export interface CreateDocumentInput {
  title: string;
  kind: DocKind;
  project: { id: string; name: string; slug: string; hue: AccentHue };
  body?: string;
}

export function useCreateDocument() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateDocumentInput) => {
      await simulateLatency(300);
      const doc: DocumentWithProject = {
        id: `d_${crypto.randomUUID().slice(0, 8)}`,
        title: input.title.trim(),
        kind: input.kind,
        excerpt: input.body?.trim().slice(0, 120) || "No content yet.",
        ownerId: currentUser.id,
        updatedAt: new Date().toISOString(),
        body: input.body?.trim() || undefined,
        projectId: input.project.id,
        projectName: input.project.name,
        projectSlug: input.project.slug,
        projectHue: input.project.hue,
      };
      return doc;
    },
    onSuccess: (doc) => {
      addCreatedDoc(doc);
      recordNotification(`You created “${doc.title}” in ${doc.projectName}`);
      client.setQueryData<DocumentWithProject[]>(queryKeys.documents, (old) =>
        old ? [doc, ...old] : old,
      );
      const base: DocumentItem = {
        id: doc.id,
        title: doc.title,
        kind: doc.kind,
        excerpt: doc.excerpt,
        ownerId: doc.ownerId,
        updatedAt: doc.updatedAt,
        body: doc.body,
      };
      client.setQueryData<ProjectDetail>(
        queryKeys.projectDetail(doc.projectSlug),
        (old) => (old ? { ...old, documents: [base, ...old.documents] } : old),
      );
    },
  });
}

export function useDeleteDocument() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; projectSlug: string }) => {
      await simulateLatency(250);
      return input;
    },
    onMutate: ({ id, projectSlug }) => {
      client.setQueryData<DocumentWithProject[]>(queryKeys.documents, (old) =>
        old?.filter((d) => d.id !== id),
      );
      client.setQueryData<ProjectDetail>(
        queryKeys.projectDetail(projectSlug),
        (old) =>
          old
            ? { ...old, documents: old.documents.filter((d) => d.id !== id) }
            : old,
      );
      deleteDoc(id);
    },
  });
}
