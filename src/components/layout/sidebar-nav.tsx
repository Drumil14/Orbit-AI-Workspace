"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { primaryNav } from "@/lib/navigation";
import { staggerChildren, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** True when `href` is the active route (exact for "/", prefix otherwise). */
function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Each item eases in from the left on mount — a quiet "labels fade in". */
const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0, transition: transition.base },
};

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      aria-label="Primary"
      className="flex flex-col gap-0.5"
      initial="hidden"
      animate="show"
      variants={staggerChildren(0.05)}
    >
      {primaryNav.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <motion.div key={item.href} variants={itemVariants}>
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
                  transition={transition.base}
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
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
