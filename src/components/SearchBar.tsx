import { Loader2, Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

// export function SearchBar({ value, onChange, onSubmit, isLoading }: Props) {
//   return (
//     <form
//       className="w-full"
//       onSubmit={(e) => {
//         e.preventDefault();
//         onSubmit();
//       }}
//     >
//       <label className="block text-sm font-medium text-slate-200 mb-2">
//         Search a word
//       </label>

//       <div className="flex gap-2">
//         <input
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           placeholder="e.g., resilient"
//           className="flex-1 rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-slate-400"
//         />
//         <button
//           type="submit"
//           disabled={isLoading || value.trim().length === 0}
//           className="rounded-xl px-4 py-3 bg-slate-100 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
//         >
//           {isLoading ? "…" : "Search"}
//         </button>
//       </div>
//     </form>
//   );
// }

export function SearchBar({ value, onChange, onSubmit, isLoading }: Props) {
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
        Search a word
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., resilient"
            className="w-full rounded-xl border pl-10 pr-10 py-3 outline-none transition
                       border-slate-200 bg-white text-slate-900 placeholder:text-slate-400
                       focus:ring-2 focus:ring-slate-300
                       dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-500"
          />

          {value.trim().length > 0 && !isLoading ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900
                         dark:hover:bg-slate-900 dark:hover:text-slate-100"
              title="Clear"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isLoading || value.trim().length === 0}
          className="rounded-xl px-4 py-3 font-medium transition inline-flex items-center gap-2
                     bg-slate-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed
                     dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
          {isLoading ? "Searching" : "Search"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Tip: press Enter to search. Audio and sources depend on availability.
      </p>
    </form>
  );
}
