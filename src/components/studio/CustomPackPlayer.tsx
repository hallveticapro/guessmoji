"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GameBoard } from "@/components/game/GameBoard";
import { primarySmallActionClassName } from "@/components/ui/styles";
import {
  CUSTOM_PACKS_STORAGE_KEY,
  getPackProblems,
  packToGame,
  readPackLibrary,
} from "@/lib/custom-packs";

type LoadedPack = {
  id: string;
  game?: ReturnType<typeof packToGame>;
  error?: string;
};

export function CustomPackPlayer() {
  const id = useSearchParams().get("id") ?? "";
  const [loaded, setLoaded] = useState<LoadedPack | null>(null);

  useEffect(() => {
    // Read once after hydration. A game keeps its snapshot even if another tab
    // edits the pack, so play never jumps back to the first card mid-round.
    const timeout = window.setTimeout(() => {
      try {
        const packs = readPackLibrary(
          window.localStorage.getItem(CUSTOM_PACKS_STORAGE_KEY),
        );
        const pack = packs.find((item) => item.id === id);
        if (!pack) {
          setLoaded({
            id,
            error:
              "This pack isn’t saved in this browser. Open My Packs to create one or import a pack file.",
          });
          return;
        }
        const problems = getPackProblems(pack);
        if (problems.length) {
          setLoaded({
            id,
            error: `This pack needs a little more work before playing. ${problems[0]}`,
          });
          return;
        }
        setLoaded({ id, game: packToGame(pack) });
      } catch {
        setLoaded({
          id,
          error:
            "Your saved packs couldn’t be opened. Return to My Packs to recover your library or import a backup.",
        });
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [id]);

  const returnHref = id ? `/studio?pack=${encodeURIComponent(id)}` : "/studio";

  if (!loaded || loaded.id !== id) {
    return (
      <p className="p-8 text-center" role="status">
        Opening your pack…
      </p>
    );
  }

  if (!loaded.game) {
    return (
      <section className="flex flex-1 items-center justify-center bg-[#fffaf0] px-5 py-16">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-black">Let’s find your pack</h1>
          <p className="my-6 text-lg leading-8 text-[#435762]" role="status">
            {loaded.error}
          </p>
          <Link className={primarySmallActionClassName} href={returnHref}>
            Back to My Packs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <GameBoard
      key={id}
      category={loaded.game.category}
      categories={[loaded.game.category]}
      initialPuzzles={loaded.game.puzzles}
      rememberCategory={false}
      useRoundHistory={false}
      minEmojiFontSize={16}
      returnHref={returnHref}
      returnLabel="Back to My Packs"
    />
  );
}
