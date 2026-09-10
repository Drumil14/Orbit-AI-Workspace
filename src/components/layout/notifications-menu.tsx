"use client";

import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { accentAvatar } from "@/lib/accent";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The bell's dropdown — a real, readable feed of workspace notifications with
 *  a working unread cursor. */
export function NotificationsMenu() {
  const { items, unread, lastReadAt, markAllRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
            className="relative"
          />
        }
      >
        <Bell />
        {unread > 0 && (
          <span className="absolute top-0.5 right-0.5 grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            Notifications
            {unread > 0 && (
              <span className="tabular rounded-full bg-primary/10 px-1.5 py-px text-[11px] font-medium text-primary">
                {unread} new
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="rounded text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 border-t border-border/60 px-3 py-10 text-center">
            <BellOff className="size-5 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">You&rsquo;re all caught up</p>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto border-t border-border/60">
            {items.map((item) => {
              const isUnread = item.at > lastReadAt;
              return (
                <li
                  key={item.id}
                  className={cn(
                    "flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-accent",
                    isUnread && "bg-primary/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-medium",
                      accentAvatar[item.actorHue ?? "slate"],
                    )}
                  >
                    {item.actorInitials ?? "•"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{item.body}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {relativeTime(item.at)}
                    </p>
                  </div>
                  {isUnread && (
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
