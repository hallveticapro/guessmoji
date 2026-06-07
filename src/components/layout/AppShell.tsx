import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { InfoModal } from "@/components/layout/InfoModal";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#17324d]">
      <header className="border-b-2 border-[#d5e4df] bg-white/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-2xl font-black tracking-normal text-[#17324d] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
            aria-label="Guessmoji home"
          >
            <Image
              src="/assets/guessmoji-logo-512.png"
              alt=""
              width={512}
              height={512}
              className="size-14 rounded-2xl border-2 border-[#d5e4df] bg-white object-cover shadow-[0_4px_0_rgba(23,50,77,0.08)]"
            />
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
                  className="rounded-full border-2 border-[#d5e4df] bg-white px-4 py-2 text-sm font-extrabold text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:border-[#8bc9c3] hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#8bc9c3]"
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

      <footer className="border-t-2 border-[#d5e4df] bg-white/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-semibold text-[#17324d]">Guessmoji</p>
          <p>Emoji puzzles for quick group games.</p>
        </div>
      </footer>
    </div>
  );
}
