type Props = {
  items: string[];
  onPick: (word: string) => void;
  onClear: () => void;
};

export function HistoryChips({ items, onPick, onClear }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">Recent</p>
        <button
          onClick={onClear}
          className="text-sm text-slate-300 hover:text-white"
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => onPick(w)}
            className="px-3 py-1.5 rounded-full border text-sm transition
						border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900
						dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-900"
            title={`Search "${w}"`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
