"use client";

import { useMemo, useState } from "react";
import { AnswerReveal } from "@/components/game/AnswerReveal";
import { GameControls } from "@/components/game/GameControls";
import { ProgressIndicator } from "@/components/game/ProgressIndicator";
import type { Category, Puzzle } from "@/types/puzzle";

type GameBoardProps = {
  category: Category;
  categories: Category[];
  initialPuzzles: Puzzle[];
  revealCategoryOnlyAfterAnswer?: boolean;
};

export function GameBoard({
  category,
  categories,
  initialPuzzles,
  revealCategoryOnlyAfterAnswer = false,
}: GameBoardProps) {
  const [puzzles, setPuzzles] = useState(initialPuzzles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const categoryNamesById = useMemo(
    () => new Map(categories.map((item) => [item.id, item.name])),
    [categories],
  );

  const currentPuzzle = puzzles[currentIndex];
  const answerCategoryName =
    categoryNamesById.get(currentPuzzle.categoryId) ?? category.name;

  function showAnswer() {
    setIsAnswerVisible(true);
  }

  function hideAnswer() {
    setIsAnswerVisible(false);
  }

  function goToNextPuzzle() {
    setCurrentIndex((index) => Math.min(index + 1, puzzles.length - 1));
    setIsAnswerVisible(false);
  }

  function goToPreviousPuzzle() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
    setIsAnswerVisible(false);
  }

  function shufflePuzzles() {
    setPuzzles((currentPuzzles) => getShuffledPuzzles(currentPuzzles));
    setCurrentIndex(0);
    setIsAnswerVisible(false);
  }

  function restartCategory() {
    setPuzzles(initialPuzzles);
    setCurrentIndex(0);
    setIsAnswerVisible(false);
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-950 px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/10 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-amber-200">
              {category.name}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-normal sm:text-3xl">
              Guess the answer
            </h1>
          </div>
          <ProgressIndicator currentIndex={currentIndex} total={puzzles.length} />
        </div>

        <div className="grid flex-1 gap-5 xl:grid-cols-[1fr_24rem]">
          <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-sm">
            <p className="text-center text-7xl leading-tight sm:text-8xl md:text-9xl lg:text-[9rem]">
              {currentPuzzle.emojis}
            </p>
          </div>

          <aside className="flex flex-col gap-4">
            <AnswerReveal
              categoryName={answerCategoryName}
              isAnswerVisible={isAnswerVisible}
              puzzle={currentPuzzle}
              revealCategoryOnlyAfterAnswer={revealCategoryOnlyAfterAnswer}
            />
            <GameControls
              canGoNext={currentIndex < puzzles.length - 1}
              canGoPrevious={currentIndex > 0}
              isAnswerVisible={isAnswerVisible}
              onHideAnswer={hideAnswer}
              onNext={goToNextPuzzle}
              onPrevious={goToPreviousPuzzle}
              onRestart={restartCategory}
              onRevealAnswer={showAnswer}
              onShuffle={shufflePuzzles}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function getShuffledPuzzles(puzzlesToShuffle: readonly Puzzle[]) {
  const shuffled = [...puzzlesToShuffle];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}
