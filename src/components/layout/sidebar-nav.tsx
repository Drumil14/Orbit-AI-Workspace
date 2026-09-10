"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { primaryNav } from "@/lib/navigation";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** True when `href` is the active route (exact for "/", prefix otherwise). */
function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/**
 * Primary nav. This is shell chrome the server already knows — it must be
 * visible on first paint, so the "labels ease in from the left" entrance runs
 * as a CSS animation (plays immediately, never waits for hydration) rather than
 * a JS/Framer opacity gate that would leave the nav blank until React boots.
 * The resting state is fully visible, so a slow/failed hydration can never
 * render a half-empty sidebar.
 */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-0.5">
      {primaryNav.map((item, index) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <div
            key={item.href}
            className="animate-in fade-in slide-in-from-left-1 fill-mode-both duration-200 ease-out"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              {/* A single shared element glides between items as the route changes. */}
              {active && (
                <motion.span
                  layoutId="sidebar-active-item"
                  transition={transition.spring}
                  className="absolute inset-0 -z-10 rounded-lg bg-card shadow-sm ring-1 ring-border/60"
                />
              )}
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-[color,transform] duration-200 group-hover:scale-110",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge ? (
                <span className="tabular inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-muted px-1 text-[11px] font-medium text-muted-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
