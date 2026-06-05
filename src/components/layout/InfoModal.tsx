"use client";

import { useId, useState } from "react";

const appLinks = [
  { label: "GitHub", href: "https://github.com/hallveticapro/guessmoji" },
  { label: "Instagram", href: "https://www.instagram.com/hallveticapro" },
  { label: "TikTok", href: "https://www.tiktok.com/@hallveticapro" },
  { label: "Threads", href: "https://www.threads.net/@hallveticapro" },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/hallveticapro" },
];

const liveUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://guessmoji.mrhallsclass.com/";

export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        aria-label="About Guessmoji"
      >
        i
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/70 p-4 sm:items-center sm:justify-center"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="w-full max-w-lg rounded-lg bg-white p-6 text-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-sky-700">
                  About
                </p>
                <h2
                  id={titleId}
                  className="mt-1 text-3xl font-black tracking-normal"
                >
                  Guessmoji
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-11 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xl font-black text-slate-700 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                aria-label="Close about dialog"
              >
                x
              </button>
            </div>

            <p className="mt-5 text-base leading-7 text-slate-700">
              Guessmoji is a fast emoji guessing game with themed packs, hidden
              answers, optional hints, and big clues for group play.
            </p>

            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-amber-300 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            >
              Open Live Site
            </a>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {appLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky-500"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
