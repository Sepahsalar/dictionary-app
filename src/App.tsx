import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { MeaningCard } from "./components/MeaningCard";
import { Skeleton } from "./components/Skeleton";
import { ErrorState } from "./components/ErrorState";
import { HistoryChips } from "./components/HistoryChips";
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

function pickAudioFromEntries(entries: DictionaryEntry[]): string | null {
  for (const e of entries) {
    const audio = e.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio;
    if (audio) return audio;
  }
  return null;
}

function entryScore(entry: DictionaryEntry): number {
  // Prefer common “word uses” over obscure variants
  // (For "hi", interjection/noun should beat adjective "high")
  const weights: Record<string, number> = {
    interjection: 50,
    noun: 30,
    verb: 25,
    adjective: 10,
    adverb: 10,
    preposition: 5,
    conjunction: 5,
    pronoun: 5,
    determiner: 5,
  };

  let score = 0;

  for (const m of entry.meanings) {
    score += weights[m.partOfSpeech] ?? 0;
  }

  // Slight boost if it has audio
  const hasAudio = entry.phonetics?.some((p) => p.audio && p.audio.length > 0);
  if (hasAudio) score += 5;

  return score;
}

export default function App() {
  const [showOthers, setShowOthers] = useState(false);
  const [query, setQuery] = useState("");
  const [history, setHistory] = useLocalStorage<string[]>(
    "dictionary.history.v1",
    []
  );
  const [state, setState] = useState<FetchState>({ status: "idle" });

  const runSearch = async (raw: string) => {
    const word = normalizeWord(raw);

    if (word.length < 1) return;

    setState({ status: "loading" });
    try {
      const data = await fetchDefinition(word);

		// ✅ NEW: keep only exact matches for the searched word
	  const filtered = data.filter((e) => e.word.trim().toLowerCase() === word);

		// If filtering removed everything, fall back to original data (safer)
	  const finalData = filtered.length > 0 ? filtered : data;

	  // ✅ NEW: sort by relevance so the best entry appears first
	  const sorted = [...finalData].sort((a, b) => entryScore(b) - entryScore(a));

	  setShowOthers(false); // ✅ NEW: reset toggle each search
	  setState({ status: "success", data: sorted });

	//   setState({ status: "success", data: finalData });


	//   const data = await fetchDefinition(word);

    //   setState({ status: "success", data });

      setHistory((prev) => {
        const next = [word, ...prev.filter((x) => x !== word)].slice(0, 10);
        return next;
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        setState({
          status: "error",
          message: "No results. Try a different word.",
        });
      } else {
        setState({
          status: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  const onSubmit = async () => {
    // ✅ CHANGE: only searches when Search/Enter happens
    await runSearch(query);
  };

  const onPickHistory = async (w: string) => {
    setQuery(w);
    // ✅ CHANGE: clicking a chip should also search immediately
	setShowOthers(false);
    await runSearch(w);
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
            Search definitions with clear UI states (loading, error, results), history,
            and pronunciation when available.
          </p>
        </header>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={onSubmit}
          isLoading={state.status === "loading"}
        />

        <HistoryChips
          items={history}
          onPick={onPickHistory}
          onClear={() => setHistory([])}
        />

        {state.status === "loading" ? <Skeleton /> : null}

        {state.status === "error" ? (
          <ErrorState title="Search failed" description={state.message} />
        ) : null}

		{state.status === "success" ? (
			<div>
				{(() => {
				const sharedAudioUrl = pickAudioFromEntries(state.data);
				const [first, ...rest] = state.data;

				return (
					<>
					{first ? (
						<MeaningCard
						key={`${first.word}-primary`}
						entry={first}
						fallbackAudioUrl={sharedAudioUrl}
						/>
					) : null}

					{rest.length > 0 ? (
						<div className="mt-4">
						<button
							type="button"
							onClick={() => setShowOthers((v) => !v)}
							className="text-sm text-slate-300 hover:text-white"
						>
							{showOthers ? "Hide other entries" : `Show other entries (${rest.length})`}
						</button>

						{showOthers ? (
							<div className="mt-4">
							{rest.map((entry, idx) => (
								<MeaningCard
								key={`${entry.word}-other-${idx}`}
								entry={entry}
								fallbackAudioUrl={sharedAudioUrl}
								/>
							))}
							</div>
						) : null}
						</div>
					) : null}
					</>
				);
				})()}
			</div>
			) : null}

        {/* {state.status === "success" ? (
			<div>
				{(() => {
				const sharedAudioUrl = pickAudioFromEntries(state.data);
				return state.data.map((entry, idx) => (
					<MeaningCard
					key={`${entry.word}-${idx}`}
					entry={entry}
					fallbackAudioUrl={sharedAudioUrl}
					/>
				));
				})()}
			</div>
			) : null} */}

		{/* {state.status === "success" ? (
          <div>
            {state.data.map((entry, idx) => (
              <MeaningCard key={`${entry.word}-${idx}`} entry={entry} />
            ))}
          </div>
        ) : null} */}

        {state.status === "idle" ? (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
            <p className="text-slate-200 font-medium">Try searching for a word</p>
            <p className="mt-1 text-slate-300">
              You can search even 1-letter words. Results appear only after you press
              Search.
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
