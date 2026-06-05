import Link from "next/link";
import type { ReactNode } from "react";
import { InfoModal } from "@/components/layout/InfoModal";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] text-slate-950">
      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-2xl font-black tracking-normal text-slate-950 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
            aria-label="Guessmoji home"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-sky-500 text-3xl shadow-sm">
              🤔
            </span>
            <span>Guessmoji</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <nav
              className="flex flex-wrap items-center gap-2"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <InfoModal />
          </div>
        </div>
      </header>

      <main id="main-content" className="flex flex-1 flex-col">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-semibold text-slate-800">Guessmoji</p>
          <p>Emoji puzzles for quick group games.</p>
        </div>
      </footer>
    </div>
  );
}
