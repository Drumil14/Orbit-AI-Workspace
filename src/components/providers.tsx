"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/**
 * Global client providers, composed once at the root.
 *
 * The QueryClient is created lazily in state so it survives Fast Refresh and
 * is never shared across requests on the server. Defaults lean "calm": data
 * stays fresh for a minute and we don't refetch on every window focus, so the
 * UI doesn't flicker while the user is simply reading.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {/* Honors prefers-reduced-motion globally, so no component re-checks it. */}
        <MotionConfig reducedMotion="user">
          <TooltipProvider delay={200}>{children}</TooltipProvider>
          <Toaster />
        </MotionConfig>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
