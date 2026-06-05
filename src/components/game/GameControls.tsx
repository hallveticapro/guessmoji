import Link from "next/link";

type GameControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isFullscreen: boolean;
  isAnswerVisible: boolean;
  onHideAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onRevealAnswer: () => void;
  onShuffle: () => void;
  onToggleFullscreen: () => void;
  onTimerChange: (duration: number) => void;
  timerDuration: number;
  timeRemaining: number;
};

const timerOptions = [
  { label: "No timer", value: 0 },
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "90s", value: 90 },
];

export function GameControls({
  canGoNext,
  canGoPrevious,
  isFullscreen,
  isAnswerVisible,
  onHideAnswer,
  onNext,
  onPrevious,
  onRestart,
  onRevealAnswer,
  onShuffle,
  onToggleFullscreen,
  onTimerChange,
  timerDuration,
  timeRemaining,
}: GameControlsProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
      <div className="grid gap-3">
        <button
          type="button"
          onClick={isAnswerVisible ? onHideAnswer : onRevealAnswer}
          className="min-h-14 rounded-lg bg-amber-300 px-5 py-3 text-lg font-black text-slate-950 transition hover:bg-amber-200 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
        >
          {isAnswerVisible ? "Hide Answer" : "Reveal Answer"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="min-h-12 rounded-lg bg-white px-4 py-3 text-base font-black text-slate-950 transition hover:bg-sky-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="min-h-12 rounded-lg bg-white px-4 py-3 text-base font-black text-slate-950 transition hover:bg-sky-100 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-white/40"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onShuffle}
            className="min-h-12 rounded-lg border border-white/20 px-4 py-3 text-base font-black text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="min-h-12 rounded-lg border border-white/20 px-4 py-3 text-base font-black text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          >
            Restart
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="min-h-12 rounded-lg border border-white/20 px-4 py-3 text-base font-black text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
        >
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </button>

        <div className="rounded-lg border border-white/20 p-3">
          <p className="text-sm font-black uppercase tracking-normal text-sky-200">
            Timer
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {timerOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onTimerChange(option.value)}
                className={
                  option.value === timerDuration
                    ? "min-h-11 rounded-lg bg-sky-300 px-3 py-2 text-sm font-black text-slate-950 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                    : "min-h-11 rounded-lg bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/20 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
          {timerDuration > 0 && (
            <p className="mt-3 text-sm font-bold text-white/80">
              {timeRemaining}s remaining
            </p>
          )}
        </div>

        <Link
          href="/categories"
          className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-base font-black text-white transition hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
        >
          Back to Categories
        </Link>
      </div>
    </div>
  );
}
