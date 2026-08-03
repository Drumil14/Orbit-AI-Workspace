import { SettingsView } from "@/components/settings/settings-view";

export const metadata = {
  title: "Settings · Orbit",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-[1.625rem] font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Manage your profile, workspace, and preferences.
        </p>
      </header>

      <SettingsView />
    </div>
  );
}
