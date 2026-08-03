import { Check } from "lucide-react";
import { StatusDot } from "@/components/common/status-dot";
import { cn } from "@/lib/utils";
import type { DocBlock, StatusTone } from "@/types";

const calloutStyle: Record<StatusTone, string> = {
  info: "border-primary/20 bg-primary/[0.04]",
  success: "border-success/25 bg-success/[0.06]",
  warning: "border-warning/30 bg-warning/[0.06]",
  danger: "border-destructive/25 bg-destructive/[0.05]",
  muted: "border-border bg-muted/40",
};

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="pt-3 text-lg font-semibold tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-[14px] leading-relaxed text-muted-foreground"
            >
              <StatusDot tone="muted" className="mt-2" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item.text} className="flex items-center gap-2.5 text-[14px]">
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  item.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-transparent",
                )}
              >
                <Check className="size-3" strokeWidth={2.5} />
              </span>
              <span
                className={cn(
                  item.done ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <div
          className={cn(
            "flex gap-2.5 rounded-xl border p-4 text-[14px] leading-relaxed text-foreground",
            calloutStyle[block.tone],
          )}
        >
          <StatusDot tone={block.tone} className="mt-2" />
          <span>{block.text}</span>
        </div>
      );
    case "divider":
      return <hr className="border-border/60" />;
  }
}

/** Renders a document's typed content blocks as calm, readable prose. */
export function DocContent({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
