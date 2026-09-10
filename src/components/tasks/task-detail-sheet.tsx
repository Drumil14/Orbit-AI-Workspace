"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, ChevronDown, FolderKanban, Trash2 } from "lucide-react";
import { Mark } from "@/components/common/mark";
import { StatusDot } from "@/components/common/status-dot";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDeleteTask, useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { getPerson, people } from "@/lib/data/people";
import { priorityMeta } from "@/lib/project-meta";
import { taskStatusMeta, taskStatusOrder } from "@/lib/status";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskWithProject } from "@/types";

const priorityOrder: TaskPriority[] = ["high", "medium", "low"];

/** A single labelled row in the detail's metadata list. */
function MetaRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-11 items-center gap-4 py-1.5">
      <span className="w-20 shrink-0 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
        {label}
      </span>
      <div className="min-w-0 flex-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

/** Borderless trigger styling — reads as editable metadata, not a heavy control. */
const editTriggerClass = "-ml-1.5 h-8 max-w-full justify-start gap-1.5 font-normal";

/**
 * The contents of the drawer for one task. Split out and keyed by task id in
 * the parent so switching tasks resets local drafts without an effect.
 */
function TaskDetailBody({
  task,
  onDeleted,
}: {
  task: TaskWithProject;
  onDeleted: () => void;
}) {
  const update = useUpdateTask();
  const remove = useDeleteTask();
  const [title, setTitle] = useState(task.title);
  const [draft, setDraft] = useState(task.description ?? "");
  const [due, setDue] = useState(task.due ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const assignee = getPerson(task.assigneeId);
  const priority = priorityMeta[task.priority];
  const descriptionDirty = draft.trim() !== (task.description ?? "");

  const patch = (p: Partial<TaskWithProject>) =>
    update.mutate({ id: task.id, projectSlug: task.projectSlug, patch: p });

  const commitTitle = () => {
    const next = title.trim();
    if (next && next !== task.title) patch({ title: next });
    else if (!next) setTitle(task.title);
  };

  const commitDue = () => {
    const next = due.trim();
    if (next !== (task.due ?? "")) patch({ due: next || undefined });
  };

  return (
    <>
      <SheetHeader>
        <Link
          href={`/projects/${task.projectSlug}`}
          className="flex w-fit items-center gap-2 rounded text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Mark seed={task.projectName} hue={task.projectHue} size="sm" />
          <span className="truncate">{task.projectName}</span>
        </Link>
        <SheetTitle className="sr-only">{task.title}</SheetTitle>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setTitle(task.title);
          }}
          aria-label="Task title"
          className="-mx-1.5 w-full rounded-md bg-transparent px-1.5 py-0.5 text-lg font-semibold tracking-tight text-foreground outline-none hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </SheetHeader>

      <SheetBody className="space-y-6">
        {/* Status — editable */}
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
            Status
          </span>
          <div className="flex flex-wrap gap-1.5">
            {taskStatusOrder.map((value) => {
              const meta = taskStatusMeta[value];
              const active = task.status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => !active && patch({ status: value })}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    active
                      ? "border-border bg-card text-foreground shadow-xs"
                      : "border-transparent bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <StatusDot tone={meta.tone} />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Metadata — editable */}
        <div className="divide-y divide-border/60 border-y border-border/60">
          <MetaRow label="Assignee">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className={editTriggerClass} />
                }
              >
                {assignee ? (
                  <span className="flex items-center gap-2">
                    <UserAvatar user={assignee} size="sm" />
                    {assignee.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-72 overflow-y-auto">
                <DropdownMenuItem onClick={() => patch({ assigneeId: undefined })}>
                  <span className="size-6" aria-hidden />
                  <span className="flex-1">Unassigned</span>
                  {!assignee && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>
                {people.map((person) => (
                  <DropdownMenuItem
                    key={person.id}
                    onClick={() => patch({ assigneeId: person.id })}
                  >
                    <UserAvatar user={person} size="sm" />
                    <span className="flex-1 truncate">{person.name}</span>
                    {person.id === task.assigneeId && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </MetaRow>

          <MetaRow label="Due">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                value={due}
                onChange={(e) => setDue(e.target.value)}
                onBlur={commitDue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") setDue(task.due ?? "");
                }}
                placeholder="No due date"
                aria-label="Due date"
                className="w-full rounded-md bg-transparent px-1.5 py-1 outline-none hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
              />
            </span>
          </MetaRow>

          <MetaRow label="Priority">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className={editTriggerClass} />
                }
              >
                <span className="flex items-center gap-1.5">
                  <StatusDot tone={priority.tone} />
                  {priority.label}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {priorityOrder.map((value) => (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => patch({ priority: value })}
                  >
                    <StatusDot tone={priorityMeta[value].tone} />
                    <span className="flex-1">{priorityMeta[value].label}</span>
                    {value === task.priority && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </MetaRow>

          <MetaRow label="Project">
            <Link
              href={`/projects/${task.projectSlug}`}
              className="flex items-center gap-1.5 rounded py-1 text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <FolderKanban className="size-3.5 text-muted-foreground" />
              {task.projectName}
            </Link>
          </MetaRow>
        </div>

        {/* Description — editable */}
        <div>
          <span className="mb-2 block text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
            Description
          </span>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="No description yet — add one…"
            rows={5}
            className="w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
          {descriptionDirty && (
            <div className="mt-2 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDraft(task.description ?? "")}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => patch({ description: draft.trim() || undefined })}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </SheetBody>

      <SheetFooter className="justify-between">
        {confirmDelete ? (
          <span className="text-sm text-muted-foreground">Delete this task?</span>
        ) : (
          <span />
        )}
        {confirmDelete ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                remove.mutate({ id: task.id, projectSlug: task.projectSlug });
                onDeleted();
              }}
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        )}
      </SheetFooter>
    </>
  );
}

/**
 * The task detail drawer — a consistent editor opened from anywhere a task is
 * clickable (the Tasks board and any project's task list). It reads the live
 * task from the cache by id (seeded by the snapshot passed on open) so inline
 * edits are reflected immediately across views.
 */
export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
}: {
  task: TaskWithProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Only fetch the cross-project list while the drawer is open; otherwise fall
  // back to the snapshot passed on open.
  const { data } = useTasks(open);
  const live = task ? (data?.find((t) => t.id === task.id) ?? task) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent aria-describedby={undefined}>
        {live && (
          <TaskDetailBody
            key={live.id}
            task={live}
            onDeleted={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
