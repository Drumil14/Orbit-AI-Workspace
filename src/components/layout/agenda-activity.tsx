import { PersonGlyph } from "@/components/common/person-glyph";
import { StatusDot } from "@/components/common/status-dot";
import type { ActivityItem } from "@/types";

export function AgendaActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section aria-label="Recent activity">
      <header className="mb-3 flex items-center gap-2">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Pulse
        </h2>
        <StatusDot tone="success" pulse label="Live" />
      </header>

      <ol className="flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2.5">
            <PersonGlyph
              seed={item.actorName}
              hue={item.actorHue}
              className="mt-0.5 size-5"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug text-muted-foreground">
                <span className="font-medium text-foreground">
                  {item.actorName}
                </span>{" "}
                {item.action}{" "}
                <span className="font-medium text-foreground">
                  {item.target}
                </span>
              </p>
              <span className="text-xs text-muted-foreground/60">
                {item.time} ago
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
