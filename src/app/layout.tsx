import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Orbit · The workspace that keeps everything in motion",
    template: "%s · Orbit",
  },
  description:
    "Orbit is the calm, fast workspace that unifies your projects, tasks, and documents, so your team always knows what to work on next.",
  applicationName: "Orbit",
  metadataBase: new URL("https://orbit.app"),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
