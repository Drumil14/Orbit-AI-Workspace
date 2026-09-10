"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Pencil,
  Shapes,
  Table2,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { Mark } from "@/components/common/mark";
import { UserAvatar } from "@/components/common/user-avatar";
import { Markdown } from "@/components/documents/markdown";
import { MarkdownEditor } from "@/components/documents/markdown-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useDeleteDocument,
  useDocuments,
  useUpdateDocument,
} from "@/hooks/use-documents";
import { getPerson } from "@/lib/data/people";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DocKind, DocumentWithProject } from "@/types";

const kindMeta: Record<DocKind, { label: string; icon: LucideIcon }> = {
  doc: { label: "Doc", icon: FileText },
  spec: { label: "Spec", icon: ClipboardList },
  design: { label: "Design", icon: Shapes },
  sheet: { label: "Sheet", icon: Table2 },
};
const kindOrder: DocKind[] = ["doc", "spec", "design", "sheet"];

function DocViewerBody({
  doc,
  onDeleted,
}: {
  doc: DocumentWithProject;
  onDeleted: () => void;
}) {
  const update = useUpdateDocument();
  const remove = useDeleteDocument();
  const [title, setTitle] = useState(doc.title);
  const [body, setBody] = useState(doc.body ?? "");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const owner = getPerson(doc.ownerId);
  const KindIcon = kindMeta[doc.kind].icon;

  const patch = (p: Partial<DocumentWithProject>) =>
    update.mutate({ id: doc.id, projectSlug: doc.projectSlug, patch: p });

  const commitTitle = () => {
    const next = title.trim();
    if (next && next !== doc.title) patch({ title: next });
    else if (!next) setTitle(doc.title);
  };

  const saveBody = () => {
    const next = body.trim();
    // Excerpt = the first non-formatting line, so cards read cleanly.
    const preview =
      next
        .split("\n")
        .map((l) => l.replace(/^[#>\-*\s]+/, "").replace(/[*`]/g, "").trim())
        .find((l) => l.length > 0) ?? "";
    patch({
      body: next || undefined,
      excerpt: preview.slice(0, 120) || "No content yet.",
    });
    setEditing(false);
  };

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href={`/projects/${doc.projectSlug}`}
            className="flex items-center gap-1.5 rounded outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Mark seed={doc.projectName} hue={doc.projectHue} size="sm" />
            <span className="truncate">{doc.projectName}</span>
          </Link>
          <span aria-hidden>·</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="xs"
                  className="-mx-1 gap-1 font-normal text-muted-foreground"
                />
              }
            >
              <KindIcon className="size-3.5" />
              {kindMeta[doc.kind].label}
              <ChevronDown className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {kindOrder.map((value) => {
                const Icon = kindMeta[value].icon;
                return (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => patch({ kind: value })}
                  >
                    <Icon className="size-3.5" />
                    <span className="flex-1">{kindMeta[value].label}</span>
                    {value === doc.kind && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <SheetTitle className="sr-only">{doc.title}</SheetTitle>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setTitle(doc.title);
          }}
          aria-label="Document title"
          className="-mx-1.5 w-full rounded-md bg-transparent px-1.5 py-0.5 text-lg font-semibold tracking-tight text-foreground outline-none hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
        />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {owner && <UserAvatar user={owner} size="sm" />}
          <span>{owner?.name}</span>
          <span aria-hidden>·</span>
          <span>Edited {relativeTime(doc.updatedAt)}</span>
        </div>
      </SheetHeader>

      <SheetBody>
        {editing ? (
          <>
            <MarkdownEditor
              value={body}
              onChange={setBody}
              placeholder="Start writing… **bold**, - lists, # headings"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBody(doc.body ?? "");
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={saveBody}>
                Save
              </Button>
            </div>
          </>
        ) : (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
                Content
              </span>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="size-3.5" />
                Edit
              </Button>
            </div>
            {doc.body ? (
              <Markdown content={doc.body} />
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="block w-full rounded-lg border border-dashed border-border/70 py-8 text-center text-sm text-muted-foreground outline-none transition-colors hover:border-border hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                No content yet — click to start writing.
              </button>
            )}
          </div>
        )}
      </SheetBody>

      <SheetFooter className={cn(confirmDelete ? "justify-between" : "justify-end")}>
        {confirmDelete && (
          <span className="text-sm text-muted-foreground">Delete this document?</span>
        )}
        {confirmDelete ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                remove.mutate({ id: doc.id, projectSlug: doc.projectSlug });
                onDeleted();
              }}
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        )}
      </SheetFooter>
    </>
  );
}

/**
 * The document viewer/editor drawer — opened from any document card (library or
 * project). Reads the live doc from the cache by id so edits reflect at once.
 */
export function DocViewerSheet({
  doc,
  open,
  onOpenChange,
}: {
  doc: DocumentWithProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data } = useDocuments(open);
  const live = doc ? (data?.find((d) => d.id === doc.id) ?? doc) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        {live && (
          <DocViewerBody
            key={live.id}
            doc={live}
            onDeleted={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
