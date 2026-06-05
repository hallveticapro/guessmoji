import Link from "next/link";

type GameControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAnswerVisible: boolean;
  onHideAnswer: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  onRevealAnswer: () => void;
  onShuffle: () => void;
};

export function GameControls({
  canGoNext,
  canGoPrevious,
  isAnswerVisible,
  onHideAnswer,
  onNext,
  onPrevious,
  onRestart,
  onRevealAnswer,
  onShuffle,
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
