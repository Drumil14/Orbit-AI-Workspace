"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { FilterChip } from "@/components/common/filter-chip";
import { DocumentCard } from "@/components/projects/detail/document-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";
import { relativeTime } from "@/lib/format";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import type { DocKind } from "@/types";

type KindFilter = "all" | DocKind;
const kindFilters: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "doc", label: "Docs" },
  { value: "spec", label: "Specs" },
  { value: "design", label: "Designs" },
  { value: "sheet", label: "Sheets" },
];

export function DocumentsBoard() {
  const { data, isPending, isError, refetch } = useDocuments();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter((doc) => {
      if (kind !== "all" && doc.kind !== kind) return false;
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.excerpt.toLowerCase().includes(q) ||
        doc.projectName.toLowerCase().includes(q)
      );
    });
  }, [data, query, kind]);

  // A read on the library: how much lives here and what changed most recently.
  const summary = useMemo(() => {
    if (!data || data.length === 0) return null;
    const latest = [...data].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    )[0];
    const projects = new Set(data.map((d) => d.projectId)).size;
    return { total: data.length, projects, latest };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          aria-label="Search documents"
          className="h-12 rounded-2xl bg-card pl-11 text-base shadow-xs"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap gap-2">
          {kindFilters.map((option) => (
            <FilterChip
              key={option.value}
              active={kind === option.value}
              onClick={() => setKind(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
        {summary && (
          <p className="text-xs text-muted-foreground">
            {summary.total} documents across {summary.projects} projects · Last
            edited{" "}
            <span className="text-foreground">
              &ldquo;{summary.latest.title}&rdquo;
            </span>{" "}
            {relativeTime(summary.latest.updatedAt)}
          </p>
        )}
      </div>

      {isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load documents"
          description="Something went wrong reaching the workspace."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents match"
          description={
            query ? `Nothing matches “${query}”.` : "Try a different filter."
          }
        />
      ) : (
        <motion.div
          variants={staggerChildren(0.04)}
          initial="hidden"
          animate="show"
          className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {visible.map((doc) => (
            <motion.div key={doc.id} variants={fadeInUp}>
              <DocumentCard
                doc={doc}
                project={{ name: doc.projectName, hue: doc.projectHue }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
