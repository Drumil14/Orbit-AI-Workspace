"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import Magnet from "@/components/Magnet";

/**
 * A subtle magnetic hover — the child drifts a few pixels toward the cursor when
 * it comes close, then eases back. Built on React Bits' `Magnet` (translate3d +
 * will-change, so it's GPU-composited). Tuned gentle (`magnetStrength` high =
 * small pull, `padding` small = only near the element) to stay calm.
 *
 * Sized as a block that fills its grid cell (Magnet ships `inline-block`), and
 * disabled entirely under reduced motion — no listeners, no transform.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <Magnet
      disabled={Boolean(reduce)}
      padding={40}
      magnetStrength={5}
      wrapperClassName="h-full"
      innerClassName="h-full"
      style={{ position: "relative", display: "block", height: "100%" }}
    >
      {children}
    </Magnet>
  );
}
