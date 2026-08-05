"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, Command, LogOut, Settings, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PersonGlyph } from "@/components/common/person-glyph";
import { StatusDot } from "@/components/common/status-dot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShell } from "@/components/layout/shell-provider";
import { userStatusTone } from "@/lib/status";
import type { User } from "@/types";

export function UserMenu({ user }: { user: User }) {
  const { setCommandOpen } = useShell();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors outline-none hover:bg-sidebar-accent focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 aria-expanded:bg-sidebar-accent">
        <span className="relative shrink-0">
          <Avatar className="size-7">
            <AvatarFallback className="bg-transparent p-0">
              <PersonGlyph seed={user.id} hue={user.hue} className="size-full ring-0" />
            </AvatarFallback>
          </Avatar>
          <StatusDot
            tone={userStatusTone[user.status]}
            label={`Status: ${user.status}`}
            className="absolute -right-0.5 -bottom-0.5 size-2.5 ring-2 ring-sidebar"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {user.role}
          </span>
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-(--anchor-width) min-w-60"
      >
        <div className="flex flex-col px-1.5 py-1.5">
          <span className="truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <UserRound className="size-4 text-muted-foreground" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="size-4 text-muted-foreground" />
          Settings
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCommandOpen(true)}>
          <Command className="size-4 text-muted-foreground" />
          Command menu
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            toast.success("Signed out");
            router.push("/login");
          }}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
