import type { Puzzle } from "@/types/puzzle";

type AnswerRevealProps = {
  categoryName: string;
  isAnswerVisible: boolean;
  isHintVisible: boolean;
  puzzle: Puzzle;
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} satisfies Record<Puzzle["difficulty"], string>;

export function AnswerReveal({
  categoryName,
  isAnswerVisible,
  isHintVisible,
  puzzle,
}: AnswerRevealProps) {
  if (!isAnswerVisible && isHintVisible && puzzle.hint) {
    return (
      <div className="mx-auto w-full max-w-4xl rounded-lg border border-sky-200 bg-sky-50 px-5 py-4 text-slate-950 shadow-sm">
        <p className="text-sm font-black uppercase tracking-normal text-sky-800">
          Hint
        </p>
        <p className="mt-2 text-lg font-bold leading-7 text-slate-800">
          {puzzle.hint}
        </p>
      </div>
    );
  }

  if (!isAnswerVisible) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-lg border border-amber-200 bg-amber-100 p-5 text-slate-950 shadow-sm">
      <p className="text-sm font-black uppercase tracking-normal text-amber-900">
        Answer
      </p>
      <h2 className="mt-2 text-4xl font-black tracking-normal sm:text-5xl">
        {puzzle.answer}
      </h2>

      <dl className="mt-5 grid gap-x-6 gap-y-3 text-base sm:grid-cols-3">
        <div>
          <dt className="font-black text-slate-700">Category</dt>
          <dd>{categoryName}</dd>
        </div>
        <div>
          <dt className="font-black text-slate-700">Difficulty</dt>
          <dd>{difficultyLabels[puzzle.difficulty]}</dd>
        </div>
        {puzzle.details && (
          <div>
            <dt className="font-black text-slate-700">Details</dt>
            <dd>{puzzle.details}</dd>
          </div>
        )}
      </dl>

      {puzzle.explanation && (
        <p className="mt-5 text-base leading-7 text-slate-700">
          {puzzle.explanation}
        </p>
      )}

      {puzzle.funFact && (
        <p className="mt-3 text-base leading-7 text-slate-700">
          <span className="font-black">Fun fact:</span> {puzzle.funFact}
        </p>
      )}
    </div>
  );
}
