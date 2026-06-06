"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

type SocialLink = {
  name: string;
  handle: string;
  href: string;
  Icon: (props: { className?: string }) => ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    handle: "hallveticapro/guessmoji",
    href: "https://github.com/hallveticapro/guessmoji",
    Icon: GitHubIcon,
  },
  {
    name: "Instagram",
    handle: "@hallveticapro",
    href: "https://www.instagram.com/hallveticapro",
    Icon: InstagramIcon,
  },
  {
    name: "TikTok",
    handle: "@hallveticapro",
    href: "https://www.tiktok.com/@hallveticapro",
    Icon: TikTokIcon,
  },
  {
    name: "Threads",
    handle: "@hallveticapro",
    href: "https://www.threads.net/@hallveticapro",
    Icon: ThreadsIcon,
  },
];

export function InfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable || focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="grid size-10 place-items-center rounded-full border-2 border-[#8bc9c3] bg-[#e1f5ef] text-lg font-black text-[#17324d] shadow-[0_3px_0_#a7d7d1] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#8bc9c3]"
        aria-label="About Guessmoji"
      >
        i
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#17324d]/60 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setIsOpen(false);
            }
          }}
          role="presentation"
        >
          <div
            ref={dialogRef}
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.35rem] border-2 border-[#d5e4df] bg-[#fffdf7] text-[#17324d] shadow-[0_10px_0_rgba(23,50,77,0.14)]"
            role="dialog"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="sticky top-3 z-10 float-right mr-3 mt-3 grid size-12 place-items-center rounded-full border-2 border-[#d5e4df] bg-white text-2xl font-black leading-none text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#8bc9c3]"
              aria-label="Close About Guessmoji"
            >
              x
            </button>

            <Image
              src="/assets/guessmoji-embed.png"
              alt="Guessmoji"
              width={1733}
              height={907}
              priority
              className="block w-full border-b-2 border-[#d5e4df] object-cover"
            />

            <div className="grid gap-5 p-5 sm:p-6">
              <section aria-labelledby={titleId}>
                <p className="text-xs font-black uppercase tracking-[0.1em] text-[#00778d]">
                  About the game
                </p>
                <h2
                  id={titleId}
                  className="mt-2 text-3xl font-black tracking-normal text-[#17324d]"
                >
                  About Guessmoji
                </h2>
                <p
                  id={descriptionId}
                  className="mt-3 text-base leading-7 text-[#435762]"
                >
                  Guessmoji is a quick emoji Pictionary game for shared screens.
                  Pick a themed pack, show the clue, let players make their guesses,
                  then reveal the answer with a hint, details, and a fun fact.
                </p>
                <p className="mt-3 text-base leading-7 text-[#435762]">
                  It is designed to be simple enough for quick rounds, readable from
                  across a room, and friendly for educators, families, parties, and
                  any group that wants a low-prep guessing game.
                </p>
              </section>

              <section
                className="grid gap-3 rounded-2xl border-2 border-[#f0cf74] bg-[#fff6d8] p-4"
                aria-labelledby="guessmoji-support-title"
              >
                <div>
                  <h3
                    id="guessmoji-support-title"
                    className="text-lg font-black text-[#17324d]"
                  >
                    Enjoying Guessmoji?
                  </h3>
                  <p className="mt-1 text-sm font-bold leading-6 text-[#5a4a18]">
                    Support server costs and classroom-friendly updates.
                  </p>
                </div>
                <a
                  href="https://buymeacoffee.com/hallveticapro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-transparent bg-[#ffca42] px-5 py-3 text-base font-black text-[#17324d] shadow-[0_4px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#f0cf74]"
                >
                  Buy Me A Coffee
                </a>
              </section>

              <section aria-labelledby="guessmoji-social-title">
                <h3
                  id="guessmoji-social-title"
                  className="text-sm font-black uppercase tracking-[0.1em] text-[#00778d]"
                >
                  Follow Me On Social Media
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {socialLinks.map(({ href, Icon, handle, name }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-16 items-center gap-3 rounded-xl border-2 border-[#d5e4df] bg-white p-3 text-[#17324d] no-underline transition hover:border-[#8bc9c3] hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#8bc9c3]"
                    >
                      <Icon className="size-7 shrink-0" />
                      <span className="grid min-w-0">
                        <strong className="text-sm font-black">{name}</strong>
                        <small className="truncate text-xs font-bold text-[#5a6d75]">
                          {handle}
                        </small>
                      </span>
                    </a>
                  ))}
                </div>
              </section>

              <footer className="border-t-2 border-[#d5e4df] pt-4 text-center text-sm leading-6 text-[#5a6d75]">
                <p>
                  Guessmoji is an unofficial fan-made game and is not affiliated
                  with featured brands.
                </p>
                <p className="mt-2">Made for educators with love by Andrew Hall</p>
                <p className="mt-2">© 2026 Guessmoji</p>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.9c-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.95c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92v2.8c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect width="17" height="17" x="3.5" y="3.5" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.4 3.5c.34 2.25 1.6 3.6 3.75 3.75v3.18a7.15 7.15 0 0 1-3.7-1.1v5.8c0 3.05-2.12 5.37-5.24 5.37-2.87 0-5.15-1.88-5.15-4.72 0-3.22 2.77-5.08 5.92-4.48v3.25c-1.4-.45-2.7.18-2.7 1.33 0 .92.75 1.48 1.72 1.48 1.17 0 1.92-.7 1.92-2.22V3.5h3.48Z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M16.9 10.9c-.27-3.6-2.25-5.4-5.35-5.4-3.55 0-5.8 2.58-5.8 6.55 0 4.1 2.3 6.45 6.28 6.45 3.12 0 5.15-1.42 5.15-3.62 0-1.96-1.65-3.08-4.42-3.08h-.72c-1.4 0-2.25.63-2.25 1.65 0 .95.78 1.55 1.95 1.55 1.36 0 2.25-.74 2.25-1.88 0-2.2-1.74-3.62-4.45-3.62"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M19.7 8.2c-1.15-3-3.8-4.7-7.35-4.7-5.15 0-8.35 3.45-8.35 8.65 0 5.25 3.32 8.35 8.78 8.35 4.7 0 7.55-2.35 7.55-6.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
