import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { MeaningCard } from "./components/MeaningCard";
import { Skeleton } from "./components/Skeleton";
import { ErrorState } from "./components/ErrorState";
import { HistoryChips } from "./components/HistoryChips";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { fetchDefinition, NotFoundError } from "./lib/dictionaryApi";
import type { DictionaryEntry } from "./types/dictionary";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: DictionaryEntry[] }
  | { status: "error"; message: string };

function normalizeWord(w: string) {
  return w.trim().toLowerCase();
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const [history, setHistory] = useLocalStorage<string[]>(
    "dictionary.history.v1",
    []
  );

  const [state, setState] = useState<FetchState>({ status: "idle" });

  const canAutoSearch = useMemo(() => normalizeWord(debouncedQuery).length >= 2, [
    debouncedQuery,
  ]);

  useEffect(() => {
    let isCancelled = false;

    const run = async () => {
      const word = normalizeWord(debouncedQuery);
      if (!canAutoSearch) {
        setState({ status: "idle" });
        return;
      }

      setState({ status: "loading" });
      try {
        const data = await fetchDefinition(word);
        if (isCancelled) return;

        setState({ status: "success", data });

        setHistory((prev) => {
          const next = [word, ...prev.filter((x) => x !== word)].slice(0, 10);
          return next;
        });
      } catch (e) {
        if (isCancelled) return;

        if (e instanceof NotFoundError) {
          setState({
            status: "error",
            message: "No results. Try a different word.",
          });
          return;
        }

        setState({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    };

    run();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, canAutoSearch, setHistory]);

  const onSubmit = async () => {
    // Force search immediately on Enter/button even if debounce hasn’t fired yet.
    const word = normalizeWord(query);
    if (word.length < 2) return;

    setState({ status: "loading" });
    try {
      const data = await fetchDefinition(word);
      setState({ status: "success", data });
      setHistory((prev) => [word, ...prev.filter((x) => x !== word)].slice(0, 10));
    } catch (e) {
      if (e instanceof NotFoundError) {
        setState({ status: "error", message: "No results. Try a different word." });
      } else {
        setState({ status: "error", message: "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-3 py-1 text-sm text-slate-200">
            <span>React + TypeScript</span>
            <span className="text-slate-500">•</span>
            <span>Dictionary</span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Dictionary App
          </h1>
          <p className="mt-2 text-slate-300">
            Fast search, clean UI states, and small UX details (history, audio, errors).
          </p>
        </header>

        <SearchBar value={query} onChange={setQuery} onSubmit={onSubmit} isLoading={state.status === "loading"} />
        <HistoryChips
          items={history}
          onPick={(w) => setQuery(w)}
          onClear={() => setHistory([])}
        />

        {state.status === "loading" ? <Skeleton /> : null}

        {state.status === "error" ? (
          <ErrorState title="Search failed" description={state.message} />
        ) : null}

        {state.status === "success" ? (
          <div>
            {state.data.map((entry, idx) => (
              <MeaningCard key={`${entry.word}-${idx}`} entry={entry} />
            ))}
          </div>
        ) : null}

        {state.status === "idle" ? (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
            <p className="text-slate-200 font-medium">Try searching for a word</p>
            <p className="mt-1 text-slate-300">
              Tip: type at least 2 characters. Searches run automatically.
            </p>
          </div>
        ) : null}

        <footer className="mt-10 text-sm text-slate-400">
          Built with React, TypeScript, Vite, Tailwind.
        </footer>
      </div>
    </div>
  );
}
