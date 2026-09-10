import { Fragment, type ReactNode } from "react";
import { Square, SquareCheckBig } from "lucide-react";

/**
 * A tiny, dependency-free Markdown renderer for document bodies. Supports the
 * subset a working doc needs: headings (#, ##, ###), bold/italic/inline-code,
 * unordered/ordered lists, checklists (- [ ] / - [x]), blockquotes, and rules.
 * Deliberately small and forgiving — plain text renders as paragraphs.
 */

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {m[1]}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      nodes.push(<em key={key}>{m[2]}</em>);
    } else if (m[3] !== undefined) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {m[3]}
        </code>,
      );
    }
    last = m.index + m[0].length;
    key++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();

    // Blank line
    if (trimmed === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push(<hr key={key++} className="my-4 border-border/70" />);
      i++;
      continue;
    }

    // Heading
    const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1]!.length;
      const text = heading[2]!;
      const cls =
        level === 1
          ? "mt-5 mb-2 text-lg font-semibold tracking-tight text-foreground first:mt-0"
          : level === 2
            ? "mt-4 mb-1.5 text-base font-semibold text-foreground first:mt-0"
            : "mt-3 mb-1 text-sm font-semibold text-foreground first:mt-0";
      const Tag = (`h${level}` as "h1" | "h2" | "h3");
      blocks.push(
        <Tag key={key++} className={cls}>
          {renderInline(text)}
        </Tag>,
      );
      i++;
      continue;
    }

    // Checklist
    if (/^-\s+\[( |x|X)\]\s+/.test(trimmed)) {
      const items: { done: boolean; text: string }[] = [];
      while (i < lines.length) {
        const t = lines[i]!.trim();
        const mm = /^-\s+\[( |x|X)\]\s+(.*)$/.exec(t);
        if (!mm) break;
        items.push({ done: mm[1]!.toLowerCase() === "x", text: mm[2]! });
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-2 space-y-1.5">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              {it.done ? (
                <SquareCheckBig className="mt-0.5 size-3.5 shrink-0 text-primary" />
              ) : (
                <Square className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60" />
              )}
              <span
                className={
                  it.done ? "text-muted-foreground line-through" : "text-foreground"
                }
              >
                {renderInline(it.text)}
              </span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="my-2 list-disc space-y-1 pl-5 text-sm text-foreground marker:text-muted-foreground/60">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i]!.trim())) {
        items.push(lines[i]!.trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="my-2 list-decimal space-y-1 pl-5 text-sm text-foreground marker:text-muted-foreground/60">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blockquote
    if (/^>\s?/.test(trimmed)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]!.trim())) {
        quote.push(lines[i]!.trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-3 border-l-2 border-primary/40 pl-3 text-sm text-muted-foreground italic"
        >
          {quote.map((q, idx) => (
            <Fragment key={idx}>
              {renderInline(q)}
              {idx < quote.length - 1 && <br />}
            </Fragment>
          ))}
        </blockquote>,
      );
      continue;
    }

    // Paragraph (consume consecutive plain lines)
    const para: string[] = [];
    while (i < lines.length) {
      const t = lines[i]!.trim();
      if (
        t === "" ||
        /^(#{1,3})\s+/.test(t) ||
        /^[-*]\s+/.test(t) ||
        /^\d+\.\s+/.test(t) ||
        /^>\s?/.test(t) ||
        /^(-{3,}|\*{3,})$/.test(t)
      ) {
        break;
      }
      para.push(t);
      i++;
    }
    blocks.push(
      <p key={key++} className="my-2 text-sm leading-relaxed text-foreground">
        {para.map((p, idx) => (
          <Fragment key={idx}>
            {renderInline(p)}
            {idx < para.length - 1 && <br />}
          </Fragment>
        ))}
      </p>,
    );
  }

  if (blocks.length === 0) {
    return <p className="text-sm text-muted-foreground">No content yet.</p>;
  }

  return <div className="[&>*:first-child]:mt-0">{blocks}</div>;
}
