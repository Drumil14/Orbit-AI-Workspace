"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ChevronsUpDown,
  ClipboardList,
  FileText,
  Shapes,
  Table2,
  type LucideIcon,
} from "lucide-react";
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
import { useCreateDocument } from "@/hooks/use-documents";
import { projects } from "@/lib/data/seed";
import type { DocKind } from "@/types";

const kindMeta: Record<DocKind, { label: string; icon: LucideIcon }> = {
  doc: { label: "Doc", icon: FileText },
  spec: { label: "Spec", icon: ClipboardList },
  design: { label: "Design", icon: Shapes },
  sheet: { label: "Sheet", icon: Table2 },
};
const kindOrder: DocKind[] = ["doc", "spec", "design", "sheet"];

export function CreateDocumentDialog({
  open,
  onOpenChange,
  defaultProjectSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProjectSlug?: string;
}) {
  const create = useCreateDocument();
  const [title, setTitle] = useState("");
  const [projectSlug, setProjectSlug] = useState(
    defaultProjectSlug ?? projects[0]!.slug,
  );
  const [kind, setKind] = useState<DocKind>("doc");

  const selected = useMemo(
    () => projects.find((p) => p.slug === projectSlug) ?? projects[0]!,
    [projectSlug],
  );
  const KindIcon = kindMeta[kind].icon;
  const canSubmit = title.trim().length > 0 && !create.isPending;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    create.mutate(
      {
        title,
        kind,
        project: {
          id: selected.id,
          name: selected.name,
          slug: selected.slug,
          hue: selected.hue,
        },
      },
      {
        onSuccess: (doc) => {
          toast(`Created “${doc.title}” in ${selected.name}`);
          onOpenChange(false);
        },
        onError: () => toast("Couldn't create the document. Try again."),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New document</DialogTitle>
          <DialogDescription>
            Name it, pick a project and type. You can write the body next.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="create-doc-title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="create-doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. API integration notes"
              autoFocus
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                  <span className="flex min-w-0 items-center gap-2">
                    <Mark seed={selected.name} hue={selected.hue} size="sm" />
                    <span className="truncate">{selected.name}</span>
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
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

            <div className="space-y-1.5">
              <span className="text-sm font-medium">Type</span>
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
                    <KindIcon className="size-4 text-muted-foreground" />
                    {kindMeta[kind].label}
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-(--anchor-width) min-w-40">
                  <DropdownMenuRadioGroup
                    value={kind}
                    onValueChange={(v) => setKind(v as DocKind)}
                  >
                    {kindOrder.map((value) => {
                      const Icon = kindMeta[value].icon;
                      return (
                        <DropdownMenuRadioItem
                          key={value}
                          value={value}
                          className="gap-2 pl-1.5"
                        >
                          <Icon className="size-4 text-muted-foreground" />
                          <span className="flex-1">{kindMeta[value].label}</span>
                        </DropdownMenuRadioItem>
                      );
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
              {create.isPending ? "Creating…" : "Create document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
