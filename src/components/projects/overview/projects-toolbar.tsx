"use client";

import { Search } from "lucide-react";
import { FilterChip } from "@/components/common/filter-chip";
import { Input } from "@/components/ui/input";
import { projectFilters, type ProjectFilter } from "./filters";

interface ProjectsToolbarProps {
  query: string;
  onQuery: (value: string) => void;
  filter: ProjectFilter;
  onFilter: (filter: ProjectFilter) => void;
  counts: Record<ProjectFilter, number>;
}

/** The overview's control surface: a large calm search, then filter chips. */
export function ProjectsToolbar({
  query,
  onQuery,
  filter,
  onFilter,
  counts,
}: ProjectsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="h-12 rounded-2xl bg-card pl-11 text-base shadow-xs"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {projectFilters.map((option) => (
          <FilterChip
            key={option.value}
            active={filter === option.value}
            count={counts[option.value]}
            onClick={() => onFilter(option.value)}
          >
            {option.label}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}
