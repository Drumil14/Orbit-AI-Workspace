"use client";

import { motion } from "framer-motion";
import { transition } from "@/lib/motion";

/**
 * Wraps each page so navigations get a subtle fade-and-rise. `template.tsx`
 * (not `layout.tsx`) re-mounts on every route change, which is what replays
 * the entrance. Reduced-motion is honored globally via MotionConfig.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.base}
    >
      {children}
    </motion.div>
  );
}
