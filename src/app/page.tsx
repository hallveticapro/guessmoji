import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-1 items-center bg-gradient-to-b from-sky-50 via-white to-amber-50 px-5 py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-normal text-sky-700">
            Classroom emoji guessing game
          </p>
          <h1 className="mt-4 text-5xl font-black tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            Guessmoji
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-700">
            Turn movie titles, characters, shows, and classroom topics into a fast,
            funny emoji guessing game.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categories"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-lg font-black text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
            >
              Start Playing
            </Link>
          </div>
        </div>

        <div className="grid min-h-80 place-items-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-center text-7xl leading-tight sm:text-8xl">
            🦁👑🌊🚀🧙‍♂️🎮
          </p>
        </div>
      </div>
    </section>
  );
}
