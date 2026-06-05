type ProgressIndicatorProps = {
  currentIndex: number;
  total: number;
};

export function ProgressIndicator({ currentIndex, total }: ProgressIndicatorProps) {
  return (
    <p className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-2 text-lg font-black text-slate-950">
      {currentIndex + 1} / {total}
    </p>
  );
}
