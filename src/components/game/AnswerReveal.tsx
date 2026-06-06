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
      <div className="mx-auto w-full max-w-4xl rounded-[1.1rem] border-2 border-[#8bc9c3] bg-[#e1f5ef] px-5 py-4 text-[#17324d] shadow-[0_5px_0_rgba(23,50,77,0.08)]">
        <p className="text-sm font-black uppercase tracking-normal text-[#00778d]">
          Hint
        </p>
        <p className="mt-2 text-lg font-bold leading-7 text-[#17324d]">
          {puzzle.hint}
        </p>
      </div>
    );
  }

  if (!isAnswerVisible) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[1.15rem] border-2 border-[#f0cf74] bg-[#fff6d8] p-5 text-[#17324d] shadow-[0_6px_0_rgba(23,50,77,0.08)]">
      <p className="text-sm font-black uppercase tracking-normal text-[#8a6500]">
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
        <p className="mt-5 text-base leading-7 text-[#435762]">
          {puzzle.explanation}
        </p>
      )}

      {puzzle.funFact && (
        <p className="mt-3 text-base leading-7 text-[#435762]">
          <span className="font-black">Fun fact:</span> {puzzle.funFact}
        </p>
      )}
    </div>
  );
}
