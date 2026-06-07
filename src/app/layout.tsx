import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { getPublicAppUrl, getPublicAppUrlString } from "@/lib/public-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = getPublicAppUrlString();
const appDescription =
  "Guessmoji is a fast emoji guessing game with themed packs, big clues, hidden answers, hints, and fun facts for quick group play.";

export const metadata: Metadata = {
  metadataBase: getPublicAppUrl(),
  title: {
    default: "Guessmoji",
    template: "%s | Guessmoji",
  },
  description: appDescription,
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Guessmoji",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Guessmoji",
    description: appDescription,
    url: appUrl,
    siteName: "Guessmoji",
    images: [
      {
        url: "/assets/guessmoji-embed.png",
        width: 1733,
        height: 907,
        alt: "Guessmoji emoji guessing game banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guessmoji",
    description: appDescription,
    images: ["/assets/guessmoji-embed.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
