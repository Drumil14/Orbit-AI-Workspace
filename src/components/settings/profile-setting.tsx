"use client";

import { toast } from "sonner";
import { SpecularCTA } from "@/components/common/specular-cta";
import { UserAvatar } from "@/components/common/user-avatar";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/data/seed";
import { SettingsSection } from "./section";

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Input>) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input {...props} />
    </label>
  );
}

export function ProfileSetting() {
  return (
    <SettingsSection
      title="Profile"
      description="How you appear across the workspace."
    >
      <div className="flex items-center gap-4">
        <UserAvatar user={currentUser} size="lg" showPresence />
        <div>
          <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser.role}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Display name" defaultValue={currentUser.name} />
        <Field label="Email" type="email" defaultValue={currentUser.email} />
      </div>

      <div className="mt-5 flex justify-end">
        <SpecularCTA onClick={() => toast.success("Profile saved")}>
          Save changes
        </SpecularCTA>
      </div>
    </SettingsSection>
  );
}
