type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function SearchBar({ value, onChange, onSubmit, isLoading }: Props) {
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="block text-sm font-medium text-slate-200 mb-2">
        Search a word
      </label>

      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., resilient"
          className="flex-1 rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-slate-400"
        />
        <button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="rounded-xl px-4 py-3 bg-slate-100 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
        >
          {isLoading ? "…" : "Search"}
        </button>
      </div>
    </form>
  );
}
