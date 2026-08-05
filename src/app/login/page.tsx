"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/common/logo";
import { OrbitalField } from "@/components/common/orbital-field";
import { SpecularCTA } from "@/components/common/specular-cta";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Orbit's front door — a demo auth screen.
 *
 * There is no backend: submitting either form simply opens the workspace (`/`).
 * The screen sets the tone. A cinematic, always-dark brand panel carries a live
 * orbital system; the auth column stays calm, focused, and theme-aware.
 */
export default function LoginPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  // Pointer parallax for the brand panel's depth layers.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.5 });
  const py = useSpring(my, { stiffness: 120, damping: 22, mass: 0.5 });
  const contentX = useTransform(px, (v) => v * 0.35);
  const contentY = useTransform(py, (v) => v * 0.35);

  function trackPointer(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 26);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 26);
  }
  function resetPointer() {
    mx.set(0);
    my.set(0);
  }

  function enterWorkspace(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Demo session — a plain session cookie the proxy gate reads. No expiry, so
    // closing the browser drops it and the next visit starts at login again.
    document.cookie = "orbit_session=1; path=/; SameSite=Lax";
    window.setTimeout(() => router.push("/"), reduce ? 0 : 560);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.08fr_1fr]">
      {/* ── Brand panel — always dark, cinematic, alive ───────────────────── */}
      <aside
        onMouseMove={trackPointer}
        onMouseLeave={resetPointer}
        className="dark relative hidden overflow-hidden bg-[#0a0a0f] text-foreground lg:flex"
      >
        <OrbitalField px={px} py={py} />
        {/* Grounding gradients: lift the top-left where the logo sits, and sink
            the bottom where the headline lands, so text always has contrast. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,15,0.55) 0%, transparent 22%, transparent 55%, rgba(8,8,12,0.82) 100%)",
          }}
        />

        <motion.div
          style={{ x: contentX, y: contentY }}
          className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <Logo />
          </motion.div>

          <div className="max-w-lg">
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
              className="mb-5 flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/45 uppercase"
            >
              <span className="size-1.5 rounded-full bg-[#8b90f2]" />
              Workspace OS
            </motion.p>
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.22 }}
              className="text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.03em] text-white text-balance xl:text-[3.15rem]"
            >
              The workspace that keeps everything in motion.
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.32 }}
              className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-white/55"
            >
              Projects, tasks, and documents in one calm, fast surface, so your
              team always knows what to work on next.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="mt-10 flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/35"
            >
              <span className="size-1.5 rounded-full bg-emerald-400/80" />
              All systems in orbit
              <span className="mx-1 text-white/15">·</span>©{" "}
              {new Date().getFullYear()} Orbit
            </motion.div>
          </div>
        </motion.div>
      </aside>

      {/* ── Auth column ───────────────────────────────────────────────────── */}
      <main className="relative flex flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="w-full max-w-[23rem]"
          >
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Demo · no password needed
              </span>
              <h2 className="text-[1.7rem] leading-tight font-semibold tracking-[-0.02em] text-foreground">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {isSignup
                  ? "Set up your Orbit workspace in seconds."
                  : "Sign in to pick up exactly where you left off."}
              </p>
            </div>

            {/* Segmented mode switch with a sliding indicator. */}
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted/70 p-1">
              {(["signin", "signup"] as const).map((value) => {
                const active = mode === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMode(value)}
                    className={cn(
                      "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="auth-tab"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className="absolute inset-0 rounded-lg bg-card shadow-sm ring-1 ring-border/60"
                      />
                    )}
                    <span className="relative">
                      {value === "signin" ? "Sign in" : "Create account"}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={enterWorkspace} className="space-y-4">
              <AnimatePresence initial={false}>
                {isSignup && (
                  <motion.div
                    key="name"
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <Field
                      id="name"
                      label="Full name"
                      icon={UserRound}
                      type="text"
                      placeholder="Ada Lovelace"
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field
                id="email"
                label="Email"
                icon={Mail}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                defaultValue="ada@orbit.app"
              />

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  {!isSignup && (
                    <button
                      type="button"
                      className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    defaultValue="orbit-demo"
                    className="h-10 px-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-2.5 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <SpecularCTA
                type="submit"
                disabled={submitting}
                className="mt-1 w-full !h-11"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Opening Orbit
                  </>
                ) : (
                  <>
                    {isSignup ? "Create account" : "Log in"}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </SpecularCTA>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={enterWorkspace}
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50"
            >
              <GoogleGlyph className="size-4" />
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account? " : "New to Orbit? "}
              <button
                type="button"
                onClick={() => setMode(isSignup ? "signin" : "signup")}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                {isSignup ? "Sign in" : "Create one"}
              </button>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/** A labelled input with a leading icon — tuned taller than the app default so
 *  the auth form breathes. */
function Field({
  id,
  label,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  icon: typeof Mail;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} className="h-10 px-9" {...props} />
      </div>
    </div>
  );
}

/** Google's mark — inline so the SSO button needs no asset. */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.95 11.95 0 0 0 12 0 12 12 0 0 0 1.29 6.61l3.98 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
