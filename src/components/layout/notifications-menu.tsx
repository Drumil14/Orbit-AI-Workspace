"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accentAvatar } from "@/lib/accent";
import { activity } from "@/lib/data/seed";
import { cn } from "@/lib/utils";

/** The bell's dropdown — a compact, readable feed of recent workspace activity. */
export function NotificationsMenu() {
  const items = activity.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative"
          />
        }
      >
        <Bell />
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="text-sm font-semibold text-foreground">
            Notifications
          </span>
          <button
            type="button"
            onClick={() => toast("You're all caught up")}
            className="rounded text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto border-t border-border/60">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-accent"
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium",
                  accentAvatar[item.actorHue],
                )}
              >
                {item.actorInitials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{item.actorName}</span>{" "}
                  {item.action}{" "}
                  <span className="font-medium">{item.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.time} ago
                </p>
              </div>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
