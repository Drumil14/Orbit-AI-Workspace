import { House, FolderKanban, ListChecks, FileText, CalendarDays } from "lucide-react";
import type { NavItem } from "@/types";

/** Primary destinations. Routes beyond Home arrive in later phases. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", icon: House, shortcut: "G H" },
  { label: "Projects", href: "/projects", icon: FolderKanban, shortcut: "G P" },
  { label: "Tasks", href: "/tasks", icon: ListChecks, shortcut: "G T", badge: 5 },
  { label: "Documents", href: "/documents", icon: FileText, shortcut: "G D" },
  { label: "Calendar", href: "/calendar", icon: CalendarDays, shortcut: "G C" },
];
