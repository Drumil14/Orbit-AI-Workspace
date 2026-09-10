import type { DocumentItem, DocumentWithProject } from "@/types";
import { readJSON, writeJSON } from "@/lib/data/local-store";

/**
 * Document mutations layered over the read-only seed, persisted to localStorage
 * — the same pattern as the task store. Created docs, field edits (rename, body,
 * kind), and deletions live here; `queries.ts` reads through these helpers.
 */

const CREATED_KEY = "orbit:docs:created";
const OVERRIDES_KEY = "orbit:docs:overrides";
const DELETED_KEY = "orbit:docs:deleted";

let created: DocumentWithProject[] = readJSON<DocumentWithProject[]>(CREATED_KEY, []);
let overrides: Record<string, Partial<DocumentItem>> = readJSON(OVERRIDES_KEY, {});
let deleted: string[] = readJSON<string[]>(DELETED_KEY, []);

/** Apply any recorded override for a document, returning a patched copy. */
export function applyDocOverride<T extends DocumentItem>(doc: T): T {
  const patch = overrides[doc.id];
  return patch ? { ...doc, ...patch } : doc;
}

/** Whether a document has been deleted. */
export function isDocDeleted(id: string): boolean {
  return deleted.includes(id);
}

/** Record (merge) a field override for a document and persist it. */
export function setDocOverride(id: string, patch: Partial<DocumentItem>): void {
  overrides = { ...overrides, [id]: { ...overrides[id], ...patch } };
  writeJSON(OVERRIDES_KEY, overrides);
}

/** Append a newly-created document and persist it. */
export function addCreatedDoc(doc: DocumentWithProject): void {
  created = [doc, ...created];
  writeJSON(CREATED_KEY, created);
}

/** Delete a document (created dropped, seed tombstoned); clears any override. */
export function deleteDoc(id: string): void {
  if (created.some((d) => d.id === id)) {
    created = created.filter((d) => d.id !== id);
    writeJSON(CREATED_KEY, created);
  } else if (!deleted.includes(id)) {
    deleted = [...deleted, id];
    writeJSON(DELETED_KEY, deleted);
  }
  if (id in overrides) {
    overrides = Object.fromEntries(
      Object.entries(overrides).filter(([key]) => key !== id),
    );
    writeJSON(OVERRIDES_KEY, overrides);
  }
}

/** All user-created documents (across every project), newest first. */
export function getCreatedDocs(): DocumentWithProject[] {
  return created;
}

/** User-created documents belonging to one project, as plain `DocumentItem`s. */
export function getCreatedDocsForProject(projectId: string): DocumentItem[] {
  return created
    .filter((doc) => doc.projectId === projectId)
    .map(
      (doc): DocumentItem => ({
        id: doc.id,
        title: doc.title,
        kind: doc.kind,
        excerpt: doc.excerpt,
        ownerId: doc.ownerId,
        updatedAt: doc.updatedAt,
        body: doc.body,
      }),
    );
}
