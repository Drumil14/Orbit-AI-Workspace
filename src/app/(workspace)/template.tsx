/**
 * Wraps each page so navigations get a subtle fade-and-rise. `template.tsx`
 * (not `layout.tsx`) re-mounts on every route change, which is what replays
 * the entrance.
 *
 * The entrance is a CSS animation, not a Framer opacity gate: it plays on first
 * paint without waiting for React to hydrate, so a hard-refresh of a deep route
 * shows the page's skeletons/content immediately instead of a blank surface
 * until the JS bundle boots. Reduced-motion is honored globally in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-200 ease-out">
      {children}
    </div>
  );
}
