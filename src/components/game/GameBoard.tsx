"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnswerReveal } from "@/components/game/AnswerReveal";
import { GameControls } from "@/components/game/GameControls";
import { ProgressIndicator } from "@/components/game/ProgressIndicator";
import type { Category, Puzzle } from "@/types/puzzle";

type GameBoardProps = {
  category: Category;
  categories: Category[];
  initialPuzzles: Puzzle[];
};

const LAST_CATEGORY_SLUG_KEY = "guessmoji:lastCategorySlug";
const LAST_CATEGORY_NAME_KEY = "guessmoji:lastCategoryName";
const TIMER_PREFERENCE_KEY = "guessmoji:timerSeconds";

export function GameBoard({
  category,
  categories,
  initialPuzzles,
}: GameBoardProps) {
  const [puzzles, setPuzzles] = useState(initialPuzzles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerStopped, setIsTimerStopped] = useState(false);

  const categoryNamesById = useMemo(
    () => new Map(categories.map((item) => [item.id, item.name])),
    [categories],
  );

  const currentPuzzle = puzzles[currentIndex];
  const answerCategoryName =
    categoryNamesById.get(currentPuzzle.categoryId) ?? category.name;
  const isLastPuzzle = currentIndex >= puzzles.length - 1;

  useEffect(() => {
    saveLocalPreference(LAST_CATEGORY_SLUG_KEY, category.slug);
    saveLocalPreference(LAST_CATEGORY_NAME_KEY, category.name);
  }, [category.name, category.slug]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const savedDuration = getSavedTimerDuration();

      if (savedDuration > 0) {
        setTimerDuration(savedDuration);
        setTimeRemaining(savedDuration);
        setIsTimerStopped(false);
      }
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const resetPuzzleState = useCallback(() => {
    setIsAnswerVisible(false);
    setIsHintVisible(false);
    setIsSettingsOpen(false);
    setIsTimerStopped(false);
    setTimeRemaining(timerDuration);
  }, [timerDuration]);

  useEffect(() => {
    if (timerDuration <= 0 || isTimerStopped || timeRemaining <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerStopped, timeRemaining, timerDuration]);

  const toggleFullscreenMode = useCallback(async () => {
    try {
      if (!document.fullscreenEnabled) {
        return;
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch {
      // Some browsers or displays can deny fullscreen requests.
    } finally {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
  }, []);

  useEffect(() => {
    function syncFullscreenState() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  const showAnswer = useCallback(() => {
    setIsAnswerVisible(true);
    setIsHintVisible(false);
    setIsTimerStopped(true);
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
    setIsTimerStopped(true);
  }, []);

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
    setPuzzles((currentPuzzles) => getShuffledPuzzles(currentPuzzles));
    setCurrentIndex(0);
    setIsComplete(false);
    resetPuzzleState();
  }, [resetPuzzleState]);

  const restartCategory = useCallback(() => {
    setPuzzles(getShuffledPuzzles(initialPuzzles));
    setCurrentIndex(0);
    setIsComplete(false);
    resetPuzzleState();
  }, [initialPuzzles, resetPuzzleState]);

  const changeTimer = useCallback(
    (duration: number) => {
      const safeDuration = Math.min(999, Math.max(0, duration));

      saveLocalPreference(TIMER_PREFERENCE_KEY, String(safeDuration));
      setTimerDuration(safeDuration);
      setTimeRemaining(safeDuration);
      setIsTimerStopped(isAnswerVisible || isComplete || safeDuration === 0);
    },
    [isAnswerVisible, isComplete],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }

        setIsHintVisible(false);
        setIsAnswerVisible(false);
        return;
      }

      if (isComplete) {
        return;
      }

      if (event.key === " ") {
        event.preventDefault();
        if (isAnswerVisible) {
          goToNextPuzzle();
          return;
        }

        showAnswer();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (isAnswerVisible) {
          goToNextPuzzle();
          return;
        }

        showAnswer();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousPuzzle();
        return;
      }

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        toggleHint();
        return;
      }

      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        shufflePuzzles();
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        restartCategory();
        return;
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
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
    isAnswerVisible,
    isComplete,
    isSettingsOpen,
    restartCategory,
    showAnswer,
    shufflePuzzles,
    toggleFullscreenMode,
    toggleHint,
  ]);

  if (isComplete) {
    return (
      <section className="flex flex-1 items-center bg-[radial-gradient(circle_at_top_right,rgba(255,202,66,0.28),transparent_24rem),linear-gradient(145deg,#fffaf0,#eef8f2)] px-5 py-12 text-[#17324d] sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl rounded-[1.35rem] border-2 border-[#d5e4df] bg-white/90 p-7 text-center shadow-[0_8px_0_rgba(23,50,77,0.08)]">
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
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-transparent bg-[#ffca42] px-7 py-3 text-lg font-black text-[#17324d] shadow-[0_5px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]"
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
          <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-[1.35rem] border-2 border-[#d5e4df] bg-white/90 p-6 text-[#17324d] shadow-[0_8px_0_rgba(23,50,77,0.08)] print:border-slate-300 sm:min-h-[28rem]">
            <p className="text-center text-7xl leading-tight sm:text-8xl md:text-9xl lg:text-[9rem]">
              {currentPuzzle.emojis}
            </p>
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
          onCloseSettings={() => setIsSettingsOpen(false)}
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

function getShuffledPuzzles(puzzlesToShuffle: readonly Puzzle[]) {
  const shuffled = [...puzzlesToShuffle];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function saveLocalPreference(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Local storage can be unavailable in locked-down browsers.
  }
}

function readLocalPreference(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getSavedTimerDuration() {
  const savedTimer = readLocalPreference(TIMER_PREFERENCE_KEY);
  const savedDuration = savedTimer ? Number.parseInt(savedTimer, 10) : 0;

  if (Number.isNaN(savedDuration) || savedDuration <= 0) {
    return 0;
  }

  return Math.min(999, savedDuration);
}
