import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { SiteShell } from "@/components/SiteShell";
import { themeScript } from "@/components/themeScript";
import { getNav } from "@/content/registry";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const code = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: {
    default: "Physical Chemistry — Postgraduate",
    template: "%s · Physical Chemistry",
  },
  description:
    "Postgraduate physical chemistry, taught in short illustrated sections. " +
    "Start from zero with the Lesson 0 orientation, then work through " +
    "electrochemistry from cell anatomy to batteries, with a quick check at " +
    "the end of every section.",
  authors: [{ name: "Yossef Hafez Alatter" }],
  keywords: [
    "physical chemistry",
    "postgraduate",
    "electrochemistry",
    "Nernst equation",
    "Butler-Volmer",
    "Tafel",
    "Levich",
    "Faraday's laws",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#080e19" },
  ],
};

/**
 * The root layout. It owns the <html> element, so `lang` and `dir` are set
 * here once and every component below relies on CSS logical properties rather
 * than deciding alignment for itself.
 *
 * The site is served from the root of the domain, with no /en prefix, so every
 * URL is `/lessons/...` exactly as it always was.
 */
export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read here, on the server, and hand the shell a slim model: the content
  // tree is not serialisable to the client and must not cross that boundary.
  const nav = getNav();

  return (
    <html
      lang="en"
      dir="ltr"
      className={`h-full ${display.variable} ${body.variable} ${code.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <ServiceWorkerRegister />
        <SiteShell nav={nav}>{children}</SiteShell>
      </body>
    </html>
  );
}
