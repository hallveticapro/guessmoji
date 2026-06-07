"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  cx,
  primaryPillActionClassName,
  primarySmallActionClassName,
  quietActionClassName,
  secondaryActionClassName,
} from "@/components/ui/styles";
import { coerceTimerSeconds } from "./timer";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [timerInputValue, setTimerInputValue] = useState(String(timerDuration));

  useEffect(() => {
    if (isSettingsOpen) {
      const timeoutId = window.setTimeout(() => {
        setTimerInputValue(String(timerDuration));
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    return undefined;
  }, [isSettingsOpen, timerDuration]);

  function applyTimer() {
    onTimerChange(coerceTimerSeconds(timerInputValue));
  }

  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseSettings();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
  }, [isSettingsOpen, onCloseSettings]);

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
              className={cx(primaryPillActionClassName, "px-9")}
            >
              Reveal
            </button>
          </>
        )}

        {isAnswerVisible && (
          <button
            type="button"
            onClick={onNext}
            className={cx(primaryPillActionClassName, "px-10")}
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
            ref={dialogRef}
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
                ref={closeButtonRef}
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
                    value={timerInputValue}
                    onChange={(event) => setTimerInputValue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        applyTimer();
                      }
                    }}
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
                      setTimerInputValue("0");
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
                  className={cx(
                    secondaryActionClassName,
                    "disabled:cursor-not-allowed disabled:bg-[#d5e4df] disabled:text-[#5a6d75] disabled:shadow-none",
                  )}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={onShuffle}
                  className={secondaryActionClassName}
                >
                  Shuffle
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className={quietActionClassName}
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  className={quietActionClassName}
                >
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
              </div>

              <Link
                href="/categories"
                className={primarySmallActionClassName}
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
