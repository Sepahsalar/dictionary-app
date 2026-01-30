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
            className="px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700 text-slate-200 hover:bg-slate-900"
            title={`Search "${w}"`}
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
