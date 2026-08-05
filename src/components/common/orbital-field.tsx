"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * The brand composition behind the auth panel: a calm orbital system.
 *
 * Concentric, foreshortened orbits precess at their own slow rates (real
 * systems don't move in lockstep), bodies ride two of them, and one accent body
 * carries Orbit's single indigo. A soft ambient glow breathes underneath and a
 * whisper-faint dot grid — the same blueprint texture as the app's work surface
 * — grounds it. Depth layers respond to the pointer with a light parallax.
 *
 * Every bit of motion is gated on `useReducedMotion`; reduced simply renders the
 * system at rest, which is composed to look intentional standing still.
 */

const FX = 336;
const FY = 214;

type Ring = {
  rx: number;
  ry: number;
  base: number;
  dur: number;
  dir: 1 | -1;
  stroke: number;
  node?: { r: number; accent?: boolean };
};

const RINGS: Ring[] = [
  { rx: 62, ry: 39, base: 0, dur: 26, dir: 1, stroke: 0.2, node: { r: 4.5, accent: true } },
  { rx: 118, ry: 74, base: 42, dur: 40, dir: -1, stroke: 0.13, node: { r: 3.5 } },
  { rx: 188, ry: 118, base: 84, dur: 62, dir: 1, stroke: 0.085, node: { r: 2.6 } },
  { rx: 268, ry: 168, base: 22, dur: 90, dir: -1, stroke: 0.055 },
];

export function OrbitalField({
  px,
  py,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const reduce = useReducedMotion();

  const glowX = useTransform(px, (v) => v * 1.8);
  const glowY = useTransform(py, (v) => v * 1.8);
  const fieldX = useTransform(px, (v) => v * -1.1);
  const fieldY = useTransform(py, (v) => v * -1.1);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blueprint dot grid — Orbit's work-surface texture, near-subliminal. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(120% 100% at 70% 30%, black 30%, transparent 85%)",
        }}
      />

      {/* Ambient glow, softly breathing. */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: FX - 300,
          top: FY - 300,
          width: 600,
          height: 600,
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(closest-side, rgba(108,114,232,0.30), rgba(108,114,232,0.05) 55%, transparent 72%)",
          filter: "blur(6px)",
        }}
        animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.svg
        viewBox="0 0 480 620"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        style={{ x: fieldX, y: fieldY }}
      >
        {RINGS.map((r, i) => (
          <motion.g
            key={i}
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              rotate: r.base,
            }}
            animate={reduce ? undefined : { rotate: r.base + 360 * r.dir }}
            transition={{ duration: r.dur * 6, repeat: Infinity, ease: "linear" }}
          >
            <ellipse
              cx={FX}
              cy={FY}
              rx={r.rx}
              ry={r.ry}
              fill="none"
              stroke={`rgba(255,255,255,${r.stroke})`}
              strokeWidth={1.1}
            />
            {r.node && (
              <>
                {r.node.accent && (
                  <circle
                    cx={FX + r.rx}
                    cy={FY}
                    r={r.node.r * 3.4}
                    fill="rgba(124,131,240,0.28)"
                  />
                )}
                <circle
                  cx={FX + r.rx}
                  cy={FY}
                  r={r.node.r}
                  fill={r.node.accent ? "#b7bbf8" : "rgba(255,255,255,0.72)"}
                />
              </>
            )}
          </motion.g>
        ))}
        {/* The focus — a still, bright core the whole system turns around. */}
        <circle cx={FX} cy={FY} r={2.4} fill="rgba(255,255,255,0.9)" />
      </motion.svg>
    </div>
  );
}
