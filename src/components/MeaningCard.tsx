import type { DictionaryEntry } from "../types/dictionary";
import { ExternalLink, Volume2, VolumeX } from "lucide-react";

function pickBestAudio(entry: DictionaryEntry): string | null {
  const audio = entry.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio;
  return audio ?? null;
}

type Props = {
  entry: DictionaryEntry;
  fallbackAudioUrl?: string | null;
};

export function MeaningCard({ entry, fallbackAudioUrl }: Props) {
  const sourceUrl = entry.sourceUrls?.find(Boolean) ?? null;

  function getDomain(url: string) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
   }
  }
  const audioUrl = pickBestAudio(entry) ?? fallbackAudioUrl ?? null;

  const play = async () => {
    if (!audioUrl) return;
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch {
      // ignore play errors
    }
  };

  return (
	<div className="mt-6 rounded-2xl border p-5
                border-slate-200 bg-white
                dark:border-slate-700 dark:bg-slate-900/40">
      <div className="flex items-start justify-between gap-3">
        <div>
		  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
			{entry.word}
		</h2>
		<p className="mt-1 text-slate-600 dark:text-slate-300">
            {entry.phonetic ||
              entry.phonetics?.find((p) => p.text)?.text ||
              "—"}
          </p>
        </div>

		<button
			type="button"
			onClick={play}
			disabled={!audioUrl}
			className={[
				"rounded-xl border px-3 py-2 text-sm font-medium transition inline-flex items-center gap-2",
				audioUrl
				? "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 " +
					"dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
				: "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed " +
					"dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-500",
			].join(" ")}
			title={audioUrl ? "Play pronunciation" : "No audio available for this entry"}
			>
			{audioUrl ? <Volume2 size={16} /> : <VolumeX size={16} />}
			<span>{audioUrl ? "Play" : "No audio"}</span>
		</button>
      </div>

      <div className="mt-5 space-y-5">
        {entry.meanings.map((m) => (
          <div key={`${entry.word}-${m.partOfSpeech}`} className="space-y-2">
            <div className="flex items-center gap-3">
			  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {m.partOfSpeech}
              </span>
			  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <ul className="space-y-2">
              {m.definitions.slice(0, 3).map((d, idx) => (
				<li key={idx} className="text-slate-900 dark:text-slate-100">
                  <p className="leading-relaxed">
					<span className="text-slate-400 dark:text-slate-400 mr-2">•</span>
                    {d.definition}
                  </p>
                  {d.example ? (
					<p className="mt-1 text-slate-600 dark:text-slate-300 italic">
                      “{d.example}”
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

		<div className="mt-5">
			{sourceUrl ? (
				<a
				className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900
							dark:text-slate-300 dark:hover:text-white"
				href={sourceUrl}
				target="_blank"
				rel="noreferrer"
				title="Open source"
				>
				<ExternalLink size={14} />
				<span>Source: {getDomain(sourceUrl)}</span>
				</a>
			) : (
				<a
				className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900
							dark:text-slate-300 dark:hover:text-white"
				href={`https://en.wiktionary.org/wiki/${encodeURIComponent(entry.word)}`}
				target="_blank"
				rel="noreferrer"
				title="Fallback source"
				>
				<ExternalLink size={14} />
				<span>Source: wiktionary.org</span>
				</a>
			)}
		</div>
    </div>
  );
}
