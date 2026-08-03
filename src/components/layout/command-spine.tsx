"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Menu, PanelLeft, PanelRight, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Kbd } from "@/components/common/kbd";
import { OrbitMark } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SpecularCTA } from "@/components/common/specular-cta";
import { primaryNav } from "@/lib/navigation";
import { CommandPill } from "./command-pill";
import { NotificationsMenu } from "./notifications-menu";
import { useShell } from "./shell-provider";
import { useWorkspace } from "./workspace-provider";

function useSectionTitle(): string {
  const pathname = usePathname();
  const match = [...primaryNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
    );
  if (match) return match.label;
  // Routes outside the primary nav (e.g. /settings) — title-case the segment.
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? segment[0]!.toUpperCase() + segment.slice(1) : "Home";
}

/** A shortcut hint styled for the dark tooltip surface. */
function TooltipKbd({ children }: { children: React.ReactNode }) {
  return (
    <Kbd className="border-transparent bg-background/15 text-background">
      {children}
    </Kbd>
  );
}

export function CommandSpine() {
  const { toggleCollapsed, setMobileOpen, toggleAgenda, setCommandOpen } =
    useShell();
  const { active } = useWorkspace();
  const section = useSectionTitle();

  return (
    <header className="sticky top-0 z-40 flex h-[var(--spine-h)] items-center gap-2 border-b border-border/70 bg-background/70 px-2.5 backdrop-blur-xl">
      {/* Left — controls + breadcrumb */}
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Open sidebar"
          onClick={() => setMobileOpen(true)}
        >
          <Menu />
        </Button>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden lg:inline-flex"
                aria-label="Toggle sidebar"
                onClick={toggleCollapsed}
              />
            }
          >
            <PanelLeft />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="flex items-center gap-1.5">
            Toggle sidebar
            <span className="flex items-center gap-0.5">
              <TooltipKbd>⌘</TooltipKbd>
              <TooltipKbd>B</TooltipKbd>
            </span>
          </TooltipContent>
        </Tooltip>

        <nav
          aria-label="Breadcrumb"
          className="ml-1 hidden items-center gap-1.5 text-sm sm:flex"
        >
          <OrbitMark className="size-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{active.name}</span>
          <ChevronRight className="size-3.5 text-muted-foreground/50" />
          <span className="text-muted-foreground">{section}</span>
        </nav>
      </div>

      {/* Center — command pill */}
      <div className="hidden flex-1 justify-center px-2 md:flex">
        <CommandPill className="max-w-md" onOpen={() => setCommandOpen(true)} />
      </div>

      {/* Right — quick actions */}
      <div className="ml-auto flex shrink-0 items-center gap-0.5 md:ml-0">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Search"
          onClick={() => setCommandOpen(true)}
        >
          <Search />
        </Button>
        <NotificationsMenu />
        <ThemeToggle />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden xl:inline-flex"
                aria-label="Toggle agenda"
                onClick={toggleAgenda}
              />
            }
          >
            <PanelRight />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="flex items-center gap-1.5">
            Toggle agenda
            <span className="flex items-center gap-0.5">
              <TooltipKbd>⌘</TooltipKbd>
              <TooltipKbd>J</TooltipKbd>
            </span>
          </TooltipContent>
        </Tooltip>
        <SpecularCTA
          className="ml-1"
          onClick={() => toast("Quick create is coming soon")}
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New</span>
        </SpecularCTA>
      </div>
    </header>
  );
}
