import type { Puzzle } from "@/types/puzzle";

type AnswerRevealProps = {
  categoryName: string;
  isAnswerVisible: boolean;
  puzzle: Puzzle;
  revealCategoryOnlyAfterAnswer?: boolean;
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
} satisfies Record<Puzzle["difficulty"], string>;

export function AnswerReveal({
  categoryName,
  isAnswerVisible,
  puzzle,
  revealCategoryOnlyAfterAnswer = false,
}: AnswerRevealProps) {
  if (!isAnswerVisible) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/10 p-5">
        <p className="text-sm font-black uppercase tracking-normal text-sky-200">
          Answer hidden
        </p>
        <p className="mt-3 text-lg leading-7 text-white/80">
          Give the class time to guess, then reveal when ready.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-100 p-5 text-slate-950 shadow-sm">
      <p className="text-sm font-black uppercase tracking-normal text-amber-900">
        Answer
      </p>
      <h2 className="mt-2 text-3xl font-black tracking-normal">{puzzle.answer}</h2>

      <dl className="mt-5 grid gap-3 text-base">
        <div>
          <dt className="font-black text-slate-700">Difficulty</dt>
          <dd>{difficultyLabels[puzzle.difficulty]}</dd>
        </div>
        {(!revealCategoryOnlyAfterAnswer || isAnswerVisible) && (
          <div>
            <dt className="font-black text-slate-700">Category</dt>
            <dd>{categoryName}</dd>
          </div>
        )}
      </dl>

      {puzzle.hint && (
        <p className="mt-5 rounded-lg bg-white/70 p-3 text-base leading-7">
          <span className="font-black">Hint:</span> {puzzle.hint}
        </p>
      )}

      {puzzle.explanation && (
        <p className="mt-3 text-base leading-7 text-slate-700">
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
