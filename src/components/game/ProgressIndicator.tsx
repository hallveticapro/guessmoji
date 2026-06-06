type ProgressIndicatorProps = {
  currentIndex: number;
  total: number;
};

export function ProgressIndicator({ currentIndex, total }: ProgressIndicatorProps) {
  return (
    <p className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#d5e4df] bg-white px-5 py-2 text-lg font-black text-[#17324d] shadow-[0_3px_0_#d5e4df]">
      {currentIndex + 1} / {total}
    </p>
  );
}
