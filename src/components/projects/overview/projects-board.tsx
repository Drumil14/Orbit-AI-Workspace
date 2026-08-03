"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderOpen, TriangleAlert } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { buildPortfolioDigest } from "@/lib/insights";
import { ease } from "@/lib/motion";
import { FeaturedProject } from "./featured-project";
import { ProjectCard } from "./project-card";
import { ProjectCardSkeleton } from "./project-card-skeleton";
import { ProjectsDigest } from "./projects-digest";
import { ProjectsToolbar } from "./projects-toolbar";
import {
  matchesFilter,
  matchesQuery,
  projectFilters,
  type ProjectFilter,
} from "./filters";

const GRID = "grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";

/**
 * The overview shell. Rather than a flat wall of equal cards, it leads with a
 * portfolio pulse and the single project most worth opening (a featured hero),
 * then lets the rest reflow with a spring layout as you filter and search.
 */
export function ProjectsBoard() {
  const { data, isPending, isError, refetch } = useProjects();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const digest = useMemo(
    () => (data ? buildPortfolioDigest(data) : null),
    [data],
  );

  const searched = useMemo(
    () => (data ?? []).filter((p) => matchesQuery(p, query)),
    [data, query],
  );

  const counts = useMemo(() => {
    const record = {} as Record<ProjectFilter, number>;
    for (const { value } of projectFilters) {
      record[value] = searched.filter((p) => matchesFilter(p, value)).length;
    }
    return record;
  }, [searched]);

  const visible = useMemo(
    () => searched.filter((p) => matchesFilter(p, filter)),
    [searched, filter],
  );

  // The featured hero only leads the default, unfiltered overview. Once the user
  // narrows the set, the page becomes a pure grid so their query stays in focus.
  const isDefaultView = filter === "all" && query.trim() === "";
  const featured =
    isDefaultView && digest?.lead
      ? (data ?? []).find((p) => p.slug === digest.lead!.slug)
      : undefined;
  const gridProjects = featured
    ? visible.filter((p) => p.id !== featured.id)
    : visible;

  return (
    <div className="space-y-6">
      {isPending ? (
        <Skeleton className="h-[104px] rounded-2xl sm:h-[92px]" />
      ) : digest ? (
        <ProjectsDigest digest={digest} showLead={!featured} />
      ) : null}

      {featured && digest?.lead && (
        <FeaturedProject project={featured} reason={digest.lead.reason} />
      )}

      <ProjectsToolbar
        query={query}
        onQuery={setQuery}
        filter={filter}
        onFilter={setFilter}
        counts={counts}
      />

      {isPending ? (
        <div className={GRID}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={TriangleAlert}
          title="Couldn't load projects"
          description="Something went wrong reaching the workspace."
          action={
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : gridProjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={featured ? "That's the whole portfolio" : "No projects match"}
          description={
            featured
              ? "Everything else is up top."
              : query
                ? `Nothing matches “${query}”.`
                : "Try a different filter."
          }
        />
      ) : (
        <motion.ul layout className={GRID}>
          <AnimatePresence mode="popLayout">
            {gridProjects.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: ease.out }}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
