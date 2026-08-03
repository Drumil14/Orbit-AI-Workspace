"use client";

import { FileText, FolderPlus, Upload, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { CardEyebrow } from "@/components/common/card";
import { accentMark } from "@/lib/accent";
import { cn } from "@/lib/utils";
import type { AccentHue } from "@/types";

const actions: {
  label: string;
  hint: string;
  icon: typeof FolderPlus;
  hue: AccentHue;
}[] = [
  { label: "New project", hint: "Start something", icon: FolderPlus, hue: "indigo" },
  { label: "New document", hint: "Blank canvas", icon: FileText, hue: "emerald" },
  { label: "Invite teammate", hint: "Grow the team", icon: UserPlus, hue: "amber" },
  { label: "Import", hint: "Bring work in", icon: Upload, hue: "sky" },
];

/**
 * A card-less row of launch tiles under Today's focus. Each tile rests as a
 * quiet recessed chip and, on hover, physically rises into an elevated card
 * (surface lifts from muted to card, gains a shadow and a real translate), so
 * the interaction reads as tactile rather than decorative.
 */
export function QuickActionsCard() {
  return (
    <section>
      <CardEyebrow className="mb-3 px-0.5">Quick actions</CardEyebrow>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ label, hint, icon: Icon, hue }) => (
          <button
            key={label}
            type="button"
            onClick={() => toast(`${label} is coming soon`)}
            className="group flex flex-col items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-left outline-none transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-border/80 hover:bg-card hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0 active:shadow-sm"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-lg transition-transform duration-200 ease-out group-hover:scale-105",
                accentMark[hue],
              )}
            >
              <Icon className="size-[18px]" />
            </span>
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                {label}
              </span>
              <span className="block text-xs text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
