"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, FileText, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Favorite, FavoriteKind } from "@/types";

const kindIcon: Record<FavoriteKind, typeof FileText> = {
  document: FileText,
  view: ListFilter,
  project: Box,
};

export function FavoriteRow({ favorite }: { favorite: Favorite }) {
  const pathname = usePathname();
  const active = pathname === favorite.href.split("?")[0];
  const Icon = kindIcon[favorite.kind];

  return (
    <Link
      href={favorite.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
        active
          ? "bg-card text-foreground shadow-sm ring-1 ring-border/60"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground/80 transition-[color,transform] duration-200 group-hover:scale-110 group-hover:text-foreground" />
      <span className="flex-1 truncate">{favorite.label}</span>
    </Link>
  );
}
