"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarSectionProps {
  label: string;
  /** Optional trailing control (e.g. an "add" button) beside the header. */
  action?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** A labeled, keyboard-accessible disclosure group for the sidebar. */
export function SidebarSection({
  label,
  action,
  defaultOpen = true,
  children,
}: SidebarSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="flex flex-col">
      <div className="flex items-center gap-1 pr-1">
        <CollapsibleTrigger className="group flex h-6 flex-1 items-center gap-1 rounded px-1 text-[12px] font-semibold tracking-wider text-muted-foreground/70 uppercase transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/50">
          <ChevronRight className="size-3.5 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-90" />
          <span>{label}</span>
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="h-[var(--collapsible-panel-height)] overflow-hidden opacity-100 transition-[height,opacity] duration-200 ease-out data-[closed]:h-0 data-[closed]:opacity-0">
        <div className="mt-1 ml-[13px] flex flex-col gap-0.5 border-l border-sidebar-border pl-2.5">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
