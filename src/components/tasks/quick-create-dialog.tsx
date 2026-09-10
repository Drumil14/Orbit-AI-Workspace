"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Mark } from "@/components/common/mark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCreateTask } from "@/hooks/use-tasks";
import { projects } from "@/lib/data/seed";

/**
 * Quick Create — the modal behind the top-bar "New" button (and the palette /
 * "Add task" affordances). Minimal by design: a title and a project. Creating a
 * task surfaces it in every open list immediately, with no page refresh.
 */
export function QuickCreateDialog({
  open,
  onOpenChange,
  defaultProjectSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectSlug?: string;
}) {
  const create = useCreateTask();
  const [title, setTitle] = useState("");
  const [projectSlug, setProjectSlug] = useState(
    defaultProjectSlug ?? projects[0]!.slug,
  );

  const selected = useMemo(
    () => projects.find((p) => p.slug === projectSlug) ?? projects[0]!,
    [projectSlug],
  );

  const canSubmit = title.trim().length > 0 && !create.isPending;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    create.mutate(
      {
        title,
        project: {
          id: selected.id,
          name: selected.name,
          slug: selected.slug,
          hue: selected.hue,
        },
      },
      {
        onSuccess: (task) => {
          toast(`Added “${task.title}” to ${selected.name}`);
          onOpenChange(false);
        },
        onError: () => toast("Couldn't create the task. Try again."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>
            Give it a title and pick a project. You can add the rest later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="quick-create-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="quick-create-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Draft the launch checklist"
              autoFocus
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-sm font-medium">Project</span>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full justify-between font-normal"
                  />
                }
              >
                <span className="flex items-center gap-2">
                  <Mark seed={selected.name} hue={selected.hue} size="sm" />
                  {selected.name}
                </span>
                <ChevronsUpDown className="size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-(--anchor-width) min-w-56">
                <DropdownMenuRadioGroup
                  value={projectSlug}
                  onValueChange={setProjectSlug}
                >
                  {projects.map((project) => (
                    <DropdownMenuRadioItem
                      key={project.id}
                      value={project.slug}
                      className="gap-2 pl-1.5"
                    >
                      <Mark seed={project.name} hue={project.hue} size="sm" />
                      <span className="flex-1 truncate">{project.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DialogFooter className="pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {create.isPending ? "Creating…" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
