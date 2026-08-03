"use client";

import { Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Mark } from "@/components/common/mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pluralize } from "@/lib/text";
import type { Workspace } from "@/types";
import { useWorkspace } from "./workspace-provider";

export function WorkspaceSwitcher() {
  const { workspaces, active, setActiveId } = useWorkspace();

  function switchTo(workspace: Workspace) {
    if (workspace.id === active.id) return;
    setActiveId(workspace.id);
    toast.success(`Switched to ${workspace.name}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 aria-expanded:bg-sidebar-accent">
        <Mark seed={active.name} hue={active.hue} size="md" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {active.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {active.department} · {pluralize(active.memberCount, "member")}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-(--anchor-width) min-w-64"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => switchTo(workspace)}
              className="gap-2.5"
            >
              <Mark seed={workspace.name} hue={workspace.hue} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{workspace.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {workspace.department}
                </span>
              </span>
              {workspace.id === active.id && (
                <Check className="size-4 shrink-0 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast("New workspace is coming soon")}>
          <Plus className="size-4 text-muted-foreground" />
          New workspace
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Workspace settings are coming soon")}>
          <Settings2 className="size-4 text-muted-foreground" />
          Workspace settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
