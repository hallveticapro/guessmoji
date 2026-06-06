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
              className="min-h-14 rounded-full border-2 border-[#8bc9c3] bg-[#e1f5ef] px-7 py-3 text-lg font-black text-[#17324d] shadow-[0_4px_0_#a7d7d1] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3] disabled:cursor-not-allowed disabled:border-[#d5e4df] disabled:bg-white/60 disabled:text-[#5a6d75]"
            >
              {isHintVisible ? "Hide Hint" : "Hint"}
            </button>
            <button
              type="button"
              onClick={onRevealAnswer}
              className="min-h-14 rounded-full border-2 border-transparent bg-[#ffca42] px-9 py-3 text-lg font-black text-[#17324d] shadow-[0_5px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]"
            >
              Reveal
            </button>
          </>
        )}

        {isAnswerVisible && (
          <button
            type="button"
            onClick={onNext}
            className="min-h-14 rounded-full border-2 border-transparent bg-[#ffca42] px-10 py-3 text-lg font-black text-[#17324d] shadow-[0_5px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]"
          >
            {nextLabel}
          </button>
        )}
      </div>

      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#17324d]/60 p-4 sm:items-center sm:justify-center"
          data-print-hidden="true"
          role="presentation"
          onClick={onCloseSettings}
        >
          <div
            aria-modal="true"
            className="w-full max-w-xl rounded-[1.35rem] border-2 border-[#d5e4df] bg-[#fffdf7] p-5 text-[#17324d] shadow-[0_10px_0_rgba(23,50,77,0.14)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-labelledby="game-settings-title"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-[#00778d]">
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
                className="grid size-11 place-items-center rounded-full border-2 border-[#d5e4df] bg-white text-2xl font-black text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
                aria-label="Close settings"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label
                  htmlFor="timer-seconds"
                  className="text-sm font-black uppercase tracking-normal text-[#5a6d75]"
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
                    className="min-h-12 flex-1 rounded-xl border-2 border-[#cbdbd8] bg-white px-4 py-3 text-lg font-bold text-[#17324d] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#8bc9c3]"
                  />
                  <button
                    type="button"
                    onClick={applyTimer}
                    className="min-h-12 rounded-xl border-2 border-transparent bg-[#00778d] px-5 py-3 text-base font-black text-white shadow-[0_4px_0_#005a6b] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
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
                    className="min-h-12 rounded-xl border-2 border-[#d5e4df] bg-white px-5 py-3 text-base font-black text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
                  >
                    Off
                  </button>
                </div>
                {timerDuration > 0 && (
                  <p className="mt-2 text-sm font-bold text-[#5a6d75]">
                    {timeRemaining}s remaining
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={!canGoPrevious}
                  className="min-h-12 rounded-xl border-2 border-transparent bg-[#17324d] px-4 py-3 text-base font-black text-white shadow-[0_4px_0_rgba(23,50,77,0.25)] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3] disabled:cursor-not-allowed disabled:bg-[#d5e4df] disabled:text-[#5a6d75] disabled:shadow-none"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onShuffle}
                  className="min-h-12 rounded-xl border-2 border-transparent bg-[#17324d] px-4 py-3 text-base font-black text-white shadow-[0_4px_0_rgba(23,50,77,0.25)] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
                >
                  Shuffle
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="min-h-12 rounded-xl border-2 border-[#d5e4df] bg-white px-4 py-3 text-base font-black text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className="min-h-12 rounded-xl border-2 border-[#d5e4df] bg-white px-4 py-3 text-base font-black text-[#17324d] shadow-[0_3px_0_#d5e4df] transition hover:-translate-y-0.5 hover:bg-[#e1f5ef] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#8bc9c3]"
                >
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
              </div>

              <Link
                href="/categories"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-transparent bg-[#ffca42] px-5 py-3 text-base font-black text-[#17324d] shadow-[0_4px_0_#d79800] transition hover:-translate-y-0.5 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf74]"
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
