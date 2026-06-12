import Link from "next/link";
import Image from "next/image";

const emojiBackdropRows = [
  "🦁👑  ❄️👭  🌊🚣‍♀️  🪔🧞‍♂️  🏠🕯️",
  "🤠🚀  🐠🔎  🏎️🏁  😊😢  🎈🏠",
  "🕷️🕸️  🛡️⭐  ⚡🔨  🐜🔍  🌌🛸",
  "👽🧘‍♂️  🤖🔵  👶👽  🛸🌌  🌑⭐",
  "🐼🥋  🐉🔥  🦁🦓  🌈🎤  🐱👢",
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-amber-100 px-5 py-16 sm:py-20 lg:px-8">
        <div
          className="absolute inset-0 flex rotate-[-3deg] flex-col justify-center gap-8 text-center text-5xl font-black leading-none opacity-20 sm:text-6xl lg:text-7xl"
          aria-hidden="true"
        >
          {emojiBackdropRows.map((row) => (
            <p key={row} className="whitespace-nowrap">
              {row}
            </p>
          ))}
        </div>
        <div className="absolute inset-0 bg-white/60" aria-hidden="true" />

        <div className="relative mx-auto flex min-h-[58svh] w-full max-w-5xl flex-col items-center justify-center py-10 text-center">
          <Image
            src="/assets/guessmoji-logo-512.png"
            alt=""
            width={512}
            height={512}
            priority
            className="mb-5 size-28 rounded-[1.7rem] border-2 border-[#d5e4df] bg-white object-cover shadow-[0_7px_0_rgba(23,50,77,0.08)]"
          />
          <p className="text-sm font-black uppercase tracking-normal text-sky-800">
            Emoji guessing game
          </p>
          <h1 className="mt-4 text-6xl font-black tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
            Guessmoji
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-slate-800 sm:text-2xl sm:leading-10">
            Turn movie titles, characters, shows, and everyday topics into a fast,
            funny emoji guessing game.
          </p>
          <div className="mt-9 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/categories"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-sky-700 px-7 py-3 text-lg font-black text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
            >
              Start Playing
            </Link>
            <Link
              href="/categories"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-slate-900 bg-white px-7 py-3 text-lg font-black text-slate-950 shadow-sm transition hover:bg-slate-950 hover:text-white focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl gap-5 text-center md:grid-cols-3">
          {[
            ["1", "Show the emoji clue"],
            ["2", "Players make their guesses"],
            ["3", "Reveal the answer and keep playing"],
          ].map(([step, label]) => (
            <div key={step} className="border-t-4 border-sky-500 px-4 py-5">
              <p className="text-4xl font-black text-slate-950">{step}</p>
              <p className="mt-2 text-lg font-bold text-slate-700">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
