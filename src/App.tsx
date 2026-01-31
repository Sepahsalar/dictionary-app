import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { MeaningCard } from "./components/MeaningCard";
import { Skeleton } from "./components/Skeleton";
import { ErrorState } from "./components/ErrorState";
import { HistoryChips } from "./components/HistoryChips";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { fetchDefinition, NotFoundError } from "./lib/dictionaryApi";
import type { DictionaryEntry } from "./types/dictionary";
import { Github } from "lucide-react";
import { ThemeToggle } from "./components/ThemeToggle";

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
	  const filtered = data.filter((e) => e.word.trim().toLowerCase() === word);
	  const finalData = filtered.length > 0 ? filtered : data;
	  const sorted = [...finalData].sort((a, b) => entryScore(b) - entryScore(a));

	  setShowOthers(false);
	  setState({ status: "success", data: sorted });

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
    await runSearch(query);
  };

  const onPickHistory = async (w: string) => {
    setQuery(w);
	setShowOthers(false);
    await runSearch(w);
  };

  return (
	<div className="min-h-screen text-slate-900 bg-gradient-to-b from-slate-50 to-slate-100 dark:text-slate-100 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
		<div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-transparent dark:shadow-none">
			<header className="mb-8">
			  <div className="flex items-start justify-between gap-4">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm
									border-slate-200 bg-white text-slate-700
									dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
						<span>📚</span>
						<span>React + TypeScript</span>
						<span className="text-slate-400 dark:text-slate-500">•</span>
						<span>Dictionary</span>
					</div>

					<h1 className="mt-4 text-4xl font-semibold tracking-tight">
						Dictionary App
					</h1>
					<p className="mt-2 text-slate-600 dark:text-slate-300">
						Search meanings with clean UI states (loading, error, results), history, and audio.
					</p>
					</div>

					<div className="flex items-center gap-2">
					<a
						className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition
								border-slate-200 bg-white text-slate-900 hover:bg-slate-50
								dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
						href="https://github.com/sepahsalar/dictionary-app"
						target="_blank"
						rel="noreferrer"
						title="Open GitHub repo"
					>
						<Github size={16} />
						<span className="hidden sm:inline">GitHub</span>
					</a>

					<ThemeToggle />
					</div>
				</div>
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
							className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
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

        {state.status === "idle" ? (
          <div className="mt-8 rounded-2xl border p-5 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40">
			<p className="font-medium text-slate-900 dark:text-slate-100">Try searching for a word</p>
			<p className="mt-1 text-slate-600 dark:text-slate-300">
              You can search even 1-letter words. Results appear only after you press
              Search.
            </p>
          </div>
        ) : null}

		<footer className="mt-10 text-sm text-slate-500 dark:text-slate-400">
          Built with React, TypeScript, Vite, Tailwind.
        </footer>
      </div>
	 </div>
    </div>
  );
}
