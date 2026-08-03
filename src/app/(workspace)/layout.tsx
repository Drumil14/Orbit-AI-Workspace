import { CommandPalette } from "@/components/command/command-palette";
import { AgendaRail } from "@/components/layout/agenda-rail";
import { AmbientFrame } from "@/components/layout/ambient-frame";
import { AmbientProvider } from "@/components/layout/ambient-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { CommandSpine } from "@/components/layout/command-spine";
import { ShellProvider } from "@/components/layout/shell-provider";
import { WorkspaceProvider } from "@/components/layout/workspace-provider";
import {
  getActivity,
  getActiveWorkspace,
  getCurrentUser,
  getFavorites,
  getPinnedProjects,
  getSchedule,
  getWorkspaces,
} from "@/lib/data/queries";

/**
 * The workspace shell — a three-zone operating-system frame:
 *   command spine (top) · sidebar · work surface · agenda rail.
 *
 * A server component, so the chrome and its data render up front with no
 * client fetch waterfall. Client providers carry the interactive concerns
 * (ambient atmosphere, shell state) below it.
 */
export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    user,
    workspaces,
    activeWorkspace,
    favorites,
    pinnedProjects,
    schedule,
    activity,
  ] = await Promise.all([
    getCurrentUser(),
    getWorkspaces(),
    getActiveWorkspace(),
    getFavorites(),
    getPinnedProjects(),
    getSchedule(),
    getActivity(),
  ]);

  return (
    <ShellProvider>
      <WorkspaceProvider
        workspaces={workspaces}
        initialActiveId={activeWorkspace.id}
      >
        <AmbientProvider>
          <AmbientFrame>
            <CommandSpine />
            <div className="flex min-h-0 flex-1">
              <AppSidebar
                user={user}
                favorites={favorites}
                pinnedProjects={pinnedProjects}
              />
              <main className="work-surface min-w-0 flex-1">{children}</main>
              <AgendaRail schedule={schedule} activity={activity} />
            </div>
            <CommandPalette />
          </AmbientFrame>
        </AmbientProvider>
      </WorkspaceProvider>
    </ShellProvider>
  );
}
