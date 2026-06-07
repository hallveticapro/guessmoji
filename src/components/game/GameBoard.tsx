"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnswerReveal } from "@/components/game/AnswerReveal";
import { EmojiClue } from "@/components/game/EmojiClue";
import { GameControls } from "@/components/game/GameControls";
import { getGameKeyboardAction } from "@/components/game/keyboard";
import { ProgressIndicator } from "@/components/game/ProgressIndicator";
import { useFullscreenMode } from "@/components/game/useFullscreenMode";
import { useGameTimer } from "@/components/game/useGameTimer";
import { useLastCategoryPersistence } from "@/components/game/useLastCategoryPersistence";
import {
  cx,
  gameCardClassName,
  primaryPillActionClassName,
} from "@/components/ui/styles";
import { getRandomizedPuzzles } from "@/lib/puzzles";
import type { Category, Puzzle } from "@/types/puzzle";

type GameBoardProps = {
  category: Category;
  categories: Category[];
  initialPuzzles: Puzzle[];
  sessionPuzzleCount?: number;
};

export function GameBoard({
  category,
  categories,
  initialPuzzles,
  sessionPuzzleCount,
}: GameBoardProps) {
  const [puzzles, setPuzzles] = useState(() =>
    getInitialSessionPuzzles(initialPuzzles, sessionPuzzleCount),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { isFullscreen, toggleFullscreenMode } = useFullscreenMode();
  const {
    changeTimer: applyTimerDuration,
    resetTimer,
    stopTimer,
    timerDuration,
    timeRemaining,
  } = useGameTimer();

  useLastCategoryPersistence(category);

  const categoryNamesById = useMemo(
    () => new Map(categories.map((item) => [item.id, item.name])),
    [categories],
  );

  const currentPuzzle = puzzles[currentIndex];
  const isLastPuzzle = currentIndex >= puzzles.length - 1;

  const preparePuzzleDeck = useCallback(() => {
    const shuffledPuzzles = getRandomizedPuzzles(initialPuzzles);

    return shuffledPuzzles.slice(0, sessionPuzzleCount ?? shuffledPuzzles.length);
  }, [initialPuzzles, sessionPuzzleCount]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setPuzzles(preparePuzzleDeck());
      setCurrentIndex(0);
      setIsComplete(false);
      setIsAnswerVisible(false);
      setIsHintVisible(false);
      setIsSettingsOpen(false);
      resetTimer();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [preparePuzzleDeck, resetTimer]);

  const resetPuzzleState = useCallback(() => {
    setIsAnswerVisible(false);
    setIsHintVisible(false);
    setIsSettingsOpen(false);
    resetTimer();
  }, [resetTimer]);

  const showAnswer = useCallback(() => {
    setIsAnswerVisible(true);
    setIsHintVisible(false);
    stopTimer();
  }, [stopTimer]);

  const hideAnswer = useCallback(() => {
    setIsAnswerVisible(false);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const toggleHint = useCallback(() => {
    if (isAnswerVisible) {
      return;
    }

    setIsHintVisible((isVisible) => !isVisible);
  }, [isAnswerVisible]);

  const completeCategory = useCallback(() => {
    setIsComplete(true);
    setIsAnswerVisible(false);
    setIsHintVisible(false);
    setIsSettingsOpen(false);
    stopTimer();
  }, [stopTimer]);

  const goToNextPuzzle = useCallback(() => {
    if (isLastPuzzle) {
      completeCategory();
      return;
    }

    setCurrentIndex((index) => Math.min(index + 1, puzzles.length - 1));
    setIsComplete(false);
    resetPuzzleState();
  }, [completeCategory, isLastPuzzle, puzzles.length, resetPuzzleState]);

  const goToPreviousPuzzle = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
    setIsComplete(false);
    resetPuzzleState();
  }, [resetPuzzleState]);

  const shufflePuzzles = useCallback(() => {
    setPuzzles((currentPuzzles) => getRandomizedPuzzles(currentPuzzles));
    setCurrentIndex(0);
    setIsComplete(false);
    resetPuzzleState();
  }, [resetPuzzleState]);

  const restartCategory = useCallback(() => {
    setPuzzles(preparePuzzleDeck());
    setCurrentIndex(0);
    setIsComplete(false);
    resetPuzzleState();
  }, [preparePuzzleDeck, resetPuzzleState]);

  const changeTimer = useCallback(
    (duration: number) => {
      applyTimerDuration(duration, isAnswerVisible || isComplete);
    },
    [applyTimerDuration, isAnswerVisible, isComplete],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      const action = getGameKeyboardAction(event.key, {
        isAnswerVisible,
        isComplete,
        isSettingsOpen,
      });

      if (!action) {
        return;
      }

      event.preventDefault();

      switch (action) {
        case "close-settings":
          setIsSettingsOpen(false);
          return;
        case "hide-clues":
          setIsHintVisible(false);
          setIsAnswerVisible(false);
          return;
        case "toggle-answer":
          if (isAnswerVisible) {
            hideAnswer();
            return;
          }

          showAnswer();
          return;
        case "next":
          goToNextPuzzle();
          return;
        case "previous":
          goToPreviousPuzzle();
          return;
        case "hint":
          toggleHint();
          return;
        case "shuffle":
          shufflePuzzles();
          return;
        case "restart":
          restartCategory();
          return;
        case "fullscreen":
          void toggleFullscreenMode();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    goToNextPuzzle,
    goToPreviousPuzzle,
    hideAnswer,
    isAnswerVisible,
    isComplete,
    isSettingsOpen,
    restartCategory,
    showAnswer,
    shufflePuzzles,
    toggleFullscreenMode,
    toggleHint,
  ]);

  if (!currentPuzzle) {
    return (
      <section className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(255,202,66,0.28),transparent_24rem),linear-gradient(145deg,#fffaf0,#eef8f2)] px-5 py-12 text-[#17324d]">
        <p className="text-lg font-black">Preparing shuffled deck...</p>
      </section>
    );
  }

  const answerCategoryName =
    categoryNamesById.get(currentPuzzle.categoryId) ?? category.name;

  if (isComplete) {
    return (
      <section className="flex flex-1 items-center bg-[radial-gradient(circle_at_top_right,rgba(255,202,66,0.28),transparent_24rem),linear-gradient(145deg,#fffaf0,#eef8f2)] px-5 py-12 text-[#17324d] sm:px-6 lg:px-8">
        <div className={cx("mx-auto w-full max-w-3xl p-7 text-center", gameCardClassName)}>
          <p className="text-sm font-black uppercase tracking-normal text-[#00778d]">
            Category complete
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">
            You finished {category.name}
          </h1>
          <p className="mt-4 text-lg font-medium leading-8 text-[#435762]">
            {puzzles.length} Guessmoji cards played.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={restartCategory}
              className={cx(primaryPillActionClassName, "px-7")}
            >
              Play Again
            </button>
            <Link
              href="/categories"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-transparent bg-[#17324d] px-7 py-3 text-lg font-black text-white shadow-[0_5px_0_rgba(23,50,77,0.25)] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
            >
              Return to Categories
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-[radial-gradient(circle_at_top_right,rgba(255,202,66,0.28),transparent_24rem),linear-gradient(145deg,#fffaf0,#eef8f2)] px-4 py-5 text-[#17324d] print:bg-white print:text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-[#00778d]">
              {category.name}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-normal sm:text-3xl">
              {isAnswerVisible ? "Answer revealed" : "Guess the answer"}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3" data-print-hidden="true">
            <ProgressIndicator currentIndex={currentIndex} total={puzzles.length} />
            {timerDuration > 0 && (
              <p
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#f0cf74] bg-[#fff6d8] px-5 py-2 text-lg font-black text-[#17324d] shadow-[0_3px_0_#f0cf74]"
                aria-live="polite"
              >
                {timeRemaining}s
              </p>
            )}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="grid size-12 place-items-center rounded-full border-2 border-[#8bc9c3] bg-[#e1f5ef] text-2xl text-[#17324d] shadow-[0_3px_0_#a7d7d1] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
              aria-label="Open game settings"
            >
              ⚙
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-5">
          <div
            className={cx(
              "flex min-h-[22rem] flex-col items-center justify-center p-6 print:border-slate-300 sm:min-h-[28rem]",
              gameCardClassName,
            )}
          >
            <EmojiClue emojis={currentPuzzle.emojis} />
          </div>

          <AnswerReveal
            categoryName={answerCategoryName}
            isAnswerVisible={isAnswerVisible}
            isHintVisible={isHintVisible}
            puzzle={currentPuzzle}
          />
        </div>

        <GameControls
          canGoPrevious={currentIndex > 0}
          hasHint={Boolean(currentPuzzle.hint)}
          isAnswerVisible={isAnswerVisible}
          isFullscreen={isFullscreen}
          isHintVisible={isHintVisible}
          isSettingsOpen={isSettingsOpen}
          nextLabel={isLastPuzzle ? "Finish" : "Next"}
          onCloseSettings={closeSettings}
          onHint={toggleHint}
          onNext={goToNextPuzzle}
          onPrevious={goToPreviousPuzzle}
          onRestart={restartCategory}
          onRevealAnswer={showAnswer}
          onShuffle={shufflePuzzles}
          onTimerChange={changeTimer}
          onToggleFullscreen={toggleFullscreenMode}
          timerDuration={timerDuration}
          timeRemaining={timeRemaining}
        />
      </div>
    </section>
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function getInitialSessionPuzzles(
  puzzlesToPlay: readonly Puzzle[],
  sessionPuzzleCount?: number,
) {
  return puzzlesToPlay.slice(0, sessionPuzzleCount ?? puzzlesToPlay.length);
}
