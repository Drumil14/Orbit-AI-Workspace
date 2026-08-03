"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMounted } from "@/hooks/use-mounted";
import { transition } from "@/lib/motion";
import type { Favorite, Project, User } from "@/types";
import { FavoriteRow } from "./favorite-row";
import { ProjectRow } from "./project-row";
import { SidebarNav } from "./sidebar-nav";
import { SidebarSection } from "./sidebar-section";
import { useShell } from "./shell-provider";
import { UserMenu } from "./user-menu";
import { WorkspaceSwitcher } from "./workspace-switcher";

const SIDEBAR_WIDTH = 264;

interface AppSidebarProps {
  user: User;
  favorites: Favorite[];
  pinnedProjects: Project[];
}

/** The sidebar's content, shared by the desktop column and the mobile drawer. */
function SidebarBody({ user, favorites, pinnedProjects }: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2.5 px-3 pt-3">
        <WorkspaceSwitcher />
        <SidebarNav />
      </div>

      <ScrollArea className="mt-4 min-h-0 flex-1">
        <div className="flex flex-col gap-4 px-3 pb-3">
          <SidebarSection label="Favorites">
            {favorites.map((favorite) => (
              <FavoriteRow key={favorite.id} favorite={favorite} />
            ))}
          </SidebarSection>

          <SidebarSection
            label="Pinned Projects"
            action={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="New project"
                onClick={() => toast("New project is coming soon")}
              >
                <Plus />
              </Button>
            }
          >
            {pinnedProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </SidebarSection>
        </div>
      </ScrollArea>

      <div className="border-t border-sidebar-border px-3 py-2">
        <UserMenu user={user} />
      </div>
    </div>
  );
}

export function AppSidebar(props: AppSidebarProps) {
  const { collapsed, mobileOpen, setMobileOpen } = useShell();
  const mounted = useMounted();
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop column — hides by animating to zero width, content reflows. */}
      <motion.aside
        aria-label="Sidebar"
        initial={false}
        animate={{ width: collapsed ? 0 : SIDEBAR_WIDTH }}
        transition={mounted ? transition.sidebar : { duration: 0 }}
        className="ambient-panel sticky top-[var(--spine-h)] z-30 hidden h-[calc(100dvh-var(--spine-h))] shrink-0 overflow-hidden border-r border-sidebar-border lg:block"
      >
        <div
          style={{ width: SIDEBAR_WIDTH }}
          className="h-full"
          inert={collapsed || undefined}
        >
          <SidebarBody {...props} />
        </div>
      </motion.aside>

      {/* Mobile drawer — off-canvas overlay. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              transition={transition.base}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            />
            <motion.aside
              aria-label="Sidebar"
              variants={{ open: { x: 0 }, closed: { x: "-100%" } }}
              transition={transition.sidebar}
              className="ambient-panel absolute inset-y-0 left-0 w-[280px] max-w-[85%] border-r border-sidebar-border shadow-lg"
            >
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close sidebar"
                onClick={() => setMobileOpen(false)}
                className="absolute top-2.5 right-2.5 z-10 text-muted-foreground"
              >
                <X />
              </Button>
              <SidebarBody {...props} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
