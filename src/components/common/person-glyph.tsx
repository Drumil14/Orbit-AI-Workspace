import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { identityPalette } from "@/lib/identity";
import { cn } from "@/lib/utils";
import type { AccentHue } from "@/types";

/**
 * A person's avatar, generated locally with DiceBear (no network) and tied to
 * their Orbit hue so it stays tonal and on-brand rather than DiceBear's default
 * candy palette. `createAvatar(...).toString()` is deterministic for a seed, so
 * the same string renders on server and client (no hydration drift), which lets
 * this stay a plain component rendered inside server trees.
 *
 * Projects and workspaces keep the geometric {@link Identity} mark — only people
 * get a character.
 */
const cache = new Map<string, string>();

function avatarSvg(seed: string, hue: AccentHue): string {
  const key = `${hue}:${seed}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const [deep, mid, light] = identityPalette[hue];
  const svg = createAvatar(thumbs, {
    seed,
    radius: 50,
    backgroundType: ["solid"],
    backgroundColor: [mid.slice(1), light.slice(1)],
    shapeColor: [deep.slice(1), mid.slice(1)],
  }).toString();

  cache.set(key, svg);
  return svg;
}

export function PersonGlyph({
  seed,
  hue,
  className,
}: {
  seed: string;
  hue: AccentHue;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "block overflow-hidden rounded-full ring-1 ring-black/[0.06] ring-inset dark:ring-white/[0.08] [&>svg]:size-full",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: avatarSvg(seed, hue) }}
    />
  );
}
