import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ClipboardList, FileText, Shapes, Table2 } from "lucide-react";
import { AvatarStack } from "@/components/common/avatar-stack";
import { getPeople, getPerson } from "@/lib/data/people";
import { shortDate } from "@/lib/format";
import type { DocKind, WorkspaceDoc } from "@/types";
import { DocContent } from "./doc-content";

const kindIcon: Record<DocKind, LucideIcon> = {
  doc: FileText,
  spec: ClipboardList,
  design: Shapes,
  sheet: Table2,
};

/** The reading view for a long-form workspace document. */
export function DocumentReader({ doc }: { doc: WorkspaceDoc }) {
  const owner = getPerson(doc.ownerId);
  const contributors = getPeople(doc.contributorIds);
  const Icon = kindIcon[doc.kind];

  return (
    <article>
      <Link
        href="/documents"
        className="inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft className="size-4" />
        Documents
      </Link>

      <header className="mt-5 border-b border-border/60 pb-6">
        <span className="grid size-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          {doc.title}
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">{doc.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {owner && <span>{owner.name}</span>}
          <span aria-hidden>·</span>
          <span>Edited {shortDate(doc.updatedAt)}</span>
          <span className="flex items-center gap-2">
            <AvatarStack users={contributors} size="sm" max={4} />
            <span className="text-xs">{contributors.length} contributors</span>
          </span>
        </div>
      </header>

      <div className="mt-8">
        <DocContent blocks={doc.blocks} />
      </div>
    </article>
  );
}
