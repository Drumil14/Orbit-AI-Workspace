"use client";

import { Mark } from "@/components/common/mark";
import { useWorkspace } from "@/components/layout/workspace-provider";
import { Badge } from "@/components/ui/badge";
import { pluralize } from "@/lib/text";
import { SettingsSection } from "./section";

export function WorkspaceSetting() {
  const { active } = useWorkspace();

  return (
    <SettingsSection
      title="Workspace"
      description="Details for your active workspace."
    >
      <div className="flex items-center gap-3">
        <Mark
          seed={active.name}
          hue={active.hue}
          size="lg"
          className="size-11 rounded-xl"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {active.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {active.department} · {pluralize(active.memberCount, "member")}
          </p>
        </div>
        <Badge variant="outline">{active.plan}</Badge>
      </div>
    </SettingsSection>
  );
}
