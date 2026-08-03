"use client";

import type { LucideIcon } from "lucide-react";
import { ClipboardList, FileText, Shapes, Table2 } from "lucide-react";
import { Mark } from "@/components/common/mark";
import { UserAvatar } from "@/components/common/user-avatar";
import { getPerson } from "@/lib/data/people";
import { relativeTime } from "@/lib/format";
import type { AccentHue, DocKind, DocumentItem } from "@/types";

const kindIcon: Record<DocKind, LucideIcon> = {
  doc: FileText,
  spec: ClipboardList,
  design: Shapes,
  sheet: Table2,
};

/** Optional project context — shown only in the cross-project library. */
interface DocProject {
  name: string;
  hue: AccentHue;
}

/** A document preview — kind glyph, title, excerpt, owner, and last edit. */
export function DocumentCard({
  doc,
  project,
}: {
  doc: DocumentItem;
  project?: DocProject;
}) {
  const Icon = kindIcon[doc.kind];
  const owner = getPerson(doc.ownerId);

  return (
    <button
      type="button"
      className="group flex h-full w-full flex-col rounded-xl border border-border/70 bg-card p-5 text-left shadow-xs transition-[transform,box-shadow,border-color] duration-200 ease-out outline-none hover:-translate-y-0.5 hover:border-border hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="size-4" />
        </span>
        {project && (
          <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            <Mark seed={project.name} hue={project.hue} size="sm" />
            <span className="truncate">{project.name}</span>
          </span>
        )}
      </div>

      <h4 className="mt-4 line-clamp-1 text-[0.95rem] font-semibold tracking-tight text-foreground">
        {doc.title}
      </h4>
      <p className="mt-1.5 line-clamp-2 min-h-[3.25em] text-[13px] leading-relaxed text-muted-foreground">
        {doc.excerpt}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/50 pt-3.5 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          {owner && <UserAvatar user={owner} size="sm" />}
          <span className="truncate">{owner?.name}</span>
        </span>
        <span className="shrink-0">{relativeTime(doc.updatedAt)}</span>
      </div>
    </button>
  );
}
