"use client";

import Link from "next/link";
import { useRef } from "react";

type GameControlsProps = {
  canGoPrevious: boolean;
  hasHint: boolean;
  isAnswerVisible: boolean;
  isFullscreen: boolean;
  isHintVisible: boolean;
  isSettingsOpen: boolean;
  nextLabel: string;
  onCloseSettings: () => void;
  onHint: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onRevealAnswer: () => void;
  onShuffle: () => void;
  onTimerChange: (duration: number) => void;
  onToggleFullscreen: () => void;
  timerDuration: number;
  timeRemaining: number;
};

export function GameControls({
  canGoPrevious,
  hasHint,
  isAnswerVisible,
  isFullscreen,
  isHintVisible,
  isSettingsOpen,
  nextLabel,
  onCloseSettings,
  onHint,
  onNext,
  onPrevious,
  onRestart,
  onRevealAnswer,
  onShuffle,
  onTimerChange,
  onToggleFullscreen,
  timerDuration,
  timeRemaining,
}: GameControlsProps) {
  const timerInputRef = useRef<HTMLInputElement>(null);

  function applyTimer() {
    const nextDuration = Number.parseInt(
      timerInputRef.current?.value ?? String(timerDuration),
      10,
    );

    if (Number.isNaN(nextDuration)) {
      onTimerChange(0);
      return;
    }

    onTimerChange(Math.min(999, Math.max(0, nextDuration)));
  }

  return (
    <>
      <div
        className="flex flex-wrap items-center justify-center gap-3 pb-2"
        data-print-hidden="true"
      >
        {!isAnswerVisible && (
          <>
            <button
              type="button"
              onClick={onHint}
              disabled={!hasHint}
              className="min-h-14 rounded-full border-2 border-white/50 bg-white px-7 py-3 text-lg font-black text-slate-950 shadow-sm transition hover:bg-sky-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/20 disabled:text-white/50"
            >
              {isHintVisible ? "Hide Hint" : "Hint"}
            </button>
            <button
              type="button"
              onClick={onRevealAnswer}
              className="min-h-14 rounded-full bg-amber-300 px-9 py-3 text-lg font-black text-slate-950 shadow-sm transition hover:bg-amber-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
            >
              Reveal
            </button>
          </>
        )}

        {isAnswerVisible && (
          <button
            type="button"
            onClick={onNext}
            className="min-h-14 rounded-full bg-emerald-300 px-10 py-3 text-lg font-black text-slate-950 shadow-sm transition hover:bg-emerald-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-emerald-200"
          >
            {nextLabel}
          </button>
        )}
      </div>

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-slate-950/70 p-4 sm:items-center sm:justify-center"
          data-print-hidden="true"
          role="presentation"
          onClick={onCloseSettings}
        >
          <div
            aria-modal="true"
            className="w-full max-w-xl rounded-lg bg-white p-5 text-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="game-settings-title"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-sky-700">
                  Game options
                </p>
                <h2
                  id="game-settings-title"
                  className="mt-1 text-2xl font-black tracking-normal"
                >
                  Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={onCloseSettings}
                className="grid size-11 place-items-center rounded-full border border-slate-200 bg-slate-50 text-2xl font-black text-slate-700 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label
                  htmlFor="timer-seconds"
                  className="text-sm font-black uppercase tracking-normal text-slate-600"
                >
                  Timer seconds
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    id="timer-seconds"
                    inputMode="numeric"
                    min={0}
                    max={999}
                    type="number"
                    defaultValue={timerDuration}
                    ref={timerInputRef}
                    className="min-h-12 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg font-bold text-slate-950 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                  />
                  <button
                    type="button"
                    onClick={applyTimer}
                    className="min-h-12 rounded-lg bg-sky-700 px-5 py-3 text-base font-black text-white transition hover:bg-sky-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (timerInputRef.current) {
                        timerInputRef.current.value = "0";
                      }

                      onTimerChange(0);
                    }}
                    className="min-h-12 rounded-lg border border-slate-300 px-5 py-3 text-base font-black text-slate-800 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                  >
                    Off
                  </button>
                </div>
                {timerDuration > 0 && (
                  <p className="mt-2 text-sm font-bold text-slate-600">
                    {timeRemaining}s remaining
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={!canGoPrevious}
                  className="min-h-12 rounded-lg bg-slate-950 px-4 py-3 text-base font-black text-white transition hover:bg-slate-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onShuffle}
                  className="min-h-12 rounded-lg bg-slate-950 px-4 py-3 text-base font-black text-white transition hover:bg-slate-800 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  Shuffle
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="min-h-12 rounded-lg border border-slate-300 px-4 py-3 text-base font-black text-slate-800 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="min-h-12 rounded-lg border border-slate-300 px-4 py-3 text-base font-black text-slate-800 transition hover:bg-slate-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-500"
                >
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
              </div>

              <Link
                href="/categories"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-amber-300 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              >
                Back to Categories
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
