"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import {
  type LucideIcon,
  Monitor,
  Moon,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { Kbd, KbdSequence } from "@/components/common/kbd";
import { OrbitMark } from "@/components/common/logo";
import { Mark } from "@/components/common/mark";
import { useShell } from "@/components/layout/shell-provider";
import { projects } from "@/lib/data/seed";
import { primaryNav } from "@/lib/navigation";
import { projectStatusMeta } from "@/lib/status";

interface RowProps {
  /** A pre-styled leading node (e.g. a project Mark). Takes precedence over `icon`. */
  leading?: ReactNode;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  /** A chord like "G P" shown at the trailing edge. */
  shortcut?: string;
  /** The verb shown on the highlighted row when there is no chord. */
  action?: string;
  /** Search text cmdk matches against; also keeps the row's identity stable. */
  value?: string;
  onSelect: () => void;
}

/**
 * One palette row. The highlighted row lifts onto an accent surface with a soft
 * ring, the icon well warms to the accent, and the trailing edge shows a chord
 * — or, on the active row, the verb for what Enter will do (Raycast's "what
 * happens next" cue).
 */
function Row({
  leading,
  icon: Icon,
  title,
  subtitle,
  shortcut,
  action = "Open",
  value,
  onSelect,
}: RowProps) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 outline-none transition-colors data-[selected=true]:bg-accent data-[selected=true]:ring-1 data-[selected=true]:ring-border/50"
    >
      <span className="grid size-8 shrink-0 place-items-center">
        {leading ?? (
          <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground ring-1 ring-transparent transition-colors group-data-[selected=true]:bg-primary/10 group-data-[selected=true]:text-primary group-data-[selected=true]:ring-primary/15">
            {Icon ? <Icon className="size-4" /> : null}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-medium text-foreground">
          {title}
        </span>
        {subtitle && (
          <span className="block truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>

      {shortcut ? (
        <KbdSequence keys={shortcut} className="opacity-80" />
      ) : (
        <span className="flex items-center gap-1.5 opacity-0 transition-opacity group-data-[selected=true]:opacity-100">
          <span className="text-[11px] font-medium text-muted-foreground">
            {action}
          </span>
          <Kbd>↵</Kbd>
        </span>
      )}
    </Command.Item>
  );
}

/** The ⌘K command palette: navigate, jump to a project, or run a quick action. */
export function CommandPalette() {
  const { commandOpen, setCommandOpen, toggleCollapsed, toggleAgenda } = useShell();
  const router = useRouter();
  const { setTheme } = useTheme();

  const run = (action: () => void) => {
    setCommandOpen(false);
    action();
  };

  return (
    <Command.Dialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      label="Command menu"
      overlayClassName="fixed inset-0 z-50 bg-foreground/25 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      contentClassName="fixed top-[14%] left-1/2 z-50 w-[92vw] max-w-xl -translate-x-1/2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150"
      className="overflow-hidden rounded-2xl border border-border/80 bg-popover shadow-lg ring-1 ring-black/[0.03] [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground/60 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group]:first-child_[cmdk-group-heading]]:pt-1"
    >
      <div className="flex items-center gap-2.5 border-b border-border/70 px-4">
        <Search className="size-[18px] shrink-0 text-muted-foreground/80" />
        <Command.Input
          placeholder="Search or jump to…"
          className="h-14 w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
          No results. Try a project name or a command.
        </Command.Empty>

        <Command.Group heading="Go to">
          {primaryNav.map(({ label, href, icon, shortcut }) => (
            <Row
              key={href}
              icon={icon}
              title={label}
              shortcut={shortcut}
              action="Jump to"
              onSelect={() => run(() => router.push(href))}
            />
          ))}
          <Row
            icon={Settings}
            title="Settings"
            action="Jump to"
            value="settings preferences"
            onSelect={() => run(() => router.push("/settings"))}
          />
        </Command.Group>

        <Command.Group heading="Projects">
          {projects.map((project) => (
            <Row
              key={project.id}
              value={project.name}
              leading={<Mark seed={project.name} hue={project.hue} size="md" />}
              title={project.name}
              subtitle={projectStatusMeta[project.status].label}
              action="Open"
              onSelect={() => run(() => router.push(`/projects/${project.slug}`))}
            />
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Row
            icon={Plus}
            title="New task"
            subtitle="Add a task to any project"
            value="new task create"
            action="Run"
            onSelect={() => run(() => toast("New task"))}
          />
          <Row
            icon={PanelLeft}
            title="Toggle sidebar"
            value="toggle sidebar"
            action="Run"
            onSelect={() => run(toggleCollapsed)}
          />
          <Row
            icon={PanelRight}
            title="Toggle agenda"
            value="toggle agenda panel"
            action="Run"
            onSelect={() => run(toggleAgenda)}
          />
        </Command.Group>

        <Command.Group heading="Appearance">
          <Row
            icon={Sun}
            title="Light theme"
            value="theme light appearance"
            action="Apply"
            onSelect={() => run(() => setTheme("light"))}
          />
          <Row
            icon={Moon}
            title="Dark theme"
            value="theme dark appearance"
            action="Apply"
            onSelect={() => run(() => setTheme("dark"))}
          />
          <Row
            icon={Monitor}
            title="System theme"
            value="theme system appearance"
            action="Apply"
            onSelect={() => run(() => setTheme("system"))}
          />
        </Command.Group>
      </Command.List>

      <div className="flex items-center justify-between border-t border-border/70 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium">
          <OrbitMark className="size-3.5" />
          Orbit
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <Kbd>esc</Kbd>
            close
          </span>
        </span>
      </div>
    </Command.Dialog>
  );
}
