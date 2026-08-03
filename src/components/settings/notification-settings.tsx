"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./section";

const prefs = [
  { id: "mentions", label: "Mentions", description: "When someone @mentions you.", on: true },
  { id: "assigned", label: "Task assignments", description: "When a task is assigned to you.", on: true },
  { id: "digest", label: "Weekly digest", description: "A Monday summary of your projects.", on: false },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        checked ? "bg-primary" : "bg-muted-foreground/25",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

export function NotificationSettings() {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(prefs.map((p) => [p.id, p.on])),
  );

  return (
    <SettingsSection
      title="Notifications"
      description="Decide what Orbit tells you about."
    >
      <ul className="flex flex-col divide-y divide-border/60">
        {prefs.map((pref) => (
          <li
            key={pref.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <Toggle
              checked={state[pref.id]}
              label={pref.label}
              onChange={() =>
                setState((s) => ({ ...s, [pref.id]: !s[pref.id] }))
              }
            />
          </li>
        ))}
      </ul>
    </SettingsSection>
  );
}
