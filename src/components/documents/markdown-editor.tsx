"use client";

import { useId } from "react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListChecks,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A lightweight Markdown editor: a formatting toolbar over a textarea. The
 * toolbar wraps or line-prefixes the current selection with Markdown, so the
 * body stays plain text (rendered by <Markdown>) with no heavy dependency.
 */
export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  const getTextarea = () =>
    document.getElementById(id) as HTMLTextAreaElement | null;

  const restore = (start: number, end: number) => {
    requestAnimationFrame(() => {
      const ta = getTextarea();
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(start, end);
    });
  };

  const wrap = (marker: string) => {
    const ta = getTextarea();
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const sel = value.slice(s, e) || "text";
    onChange(value.slice(0, s) + marker + sel + marker + value.slice(e));
    restore(s + marker.length, s + marker.length + sel.length);
  };

  const prefix = (p: string) => {
    const ta = getTextarea();
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    let lineEnd = value.indexOf("\n", e);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const prefixed = block
      .split("\n")
      .map((l) => p + l)
      .join("\n");
    onChange(value.slice(0, lineStart) + prefixed + value.slice(lineEnd));
    restore(lineStart, lineStart + prefixed.length);
  };

  const tools: { icon: LucideIcon; label: string; run: () => void }[] = [
    { icon: Heading1, label: "Heading 1", run: () => prefix("# ") },
    { icon: Heading2, label: "Heading 2", run: () => prefix("## ") },
    { icon: Bold, label: "Bold", run: () => wrap("**") },
    { icon: Italic, label: "Italic", run: () => wrap("*") },
    { icon: Code, label: "Inline code", run: () => wrap("`") },
    { icon: List, label: "Bulleted list", run: () => prefix("- ") },
    { icon: ListChecks, label: "Checklist", run: () => prefix("- [ ] ") },
    { icon: Quote, label: "Quote", run: () => prefix("> ") },
  ];

  return (
    <div className={cn("rounded-lg border border-border/70 bg-transparent dark:bg-input/30", className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 p-1">
        {tools.map(({ icon: Icon, label, run }) => (
          <button
            key={label}
            type="button"
            // Keep textarea selection when clicking a tool.
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
            aria-label={label}
            title={label}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        className="min-h-[280px] w-full resize-y bg-transparent px-3 py-2.5 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
