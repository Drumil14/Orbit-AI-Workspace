import { AppearanceSetting } from "./appearance-setting";
import { NotificationSettings } from "./notification-settings";
import { ProfileSetting } from "./profile-setting";
import { WorkspaceSetting } from "./workspace-setting";

/** Composes the settings screen from focused, self-contained sections. */
export function SettingsView() {
  return (
    <div className="space-y-6">
      <ProfileSetting />
      <div className="grid gap-6 lg:grid-cols-2">
        <AppearanceSetting />
        <WorkspaceSetting />
      </div>
      <NotificationSettings />
    </div>
  );
}
