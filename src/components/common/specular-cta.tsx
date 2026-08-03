"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import SpecularButton from "@/components/SpecularButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpecularCTAProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
}

/**
 * Orbit's signature primary CTA — React Bits `SpecularButton` (WebGL/ogl): a
 * graphite button whose soft white specular rim steers toward the cursor and
 * only brightens on proximity, so at rest it reads as a calm graphite button.
 *
 * Reserved for the *one* most important action in a section (never for every
 * button). The defaults are retuned for Orbit: an opaque near-black graphite
 * fill (the shipped defaults are transparent + light-text, which vanish on our
 * paper canvas), dark-gray base, soft white highlight, low intensity — no glow,
 * no color. React Bits ships no reduced-motion guard, so we add one: reduced
 * motion renders a static graphite button (identical look, zero animation, and
 * no WebGL context spun up).
 */
export function SpecularCTA({
  children,
  onClick,
  type = "button",
  disabled = false,
  className,
}: SpecularCTAProps) {
  const reduce = useReducedMotion();
  const content = (
    <span className="inline-flex items-center gap-1.5">{children}</span>
  );

  if (reduce) {
    return (
      <Button
        size="lg"
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "rounded-[12px] bg-neutral-900 text-neutral-50 shadow-sm hover:bg-neutral-800",
          className,
        )}
      >
        {content}
      </Button>
    );
  }

  return (
    <SpecularButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      size="sm"
      radius={12}
      tint="#161616"
      tintOpacity={1}
      baseColor="#4a4a4a"
      lineColor="#ffffff"
      textColor="#fafafa"
      intensity={0.7}
      shineSize={9}
      shineFade={38}
      thickness={1}
      speed={0.3}
      className={cn("!h-9 !px-4 !py-0 !text-sm !font-medium", className)}
    >
      {content}
    </SpecularButton>
  );
}
