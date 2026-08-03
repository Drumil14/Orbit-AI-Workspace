"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./section";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceSetting() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  // Only reflect the resolved value after mount so SSR markup stays neutral.
  const active = mounted ? theme : undefined;

  return (
    <SettingsSection
      title="Appearance"
      description="Choose how Orbit looks on this device."
    >
      <div className="grid grid-cols-3 gap-3">
        {options.map(({ value, label, icon: Icon }) => {
          const selected = active === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-primary/40 bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}
