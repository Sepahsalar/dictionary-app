import type { DictionaryEntry } from "../types/dictionary";

function pickBestAudio(entry: DictionaryEntry): string | null {
  const audio = entry.phonetics?.find((p) => p.audio && p.audio.length > 0)?.audio;
  return audio ?? null;
}

type Props = {
  entry: DictionaryEntry;
};

export function MeaningCard({ entry }: Props) {
  const audioUrl = pickBestAudio(entry);

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
    <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">{entry.word}</h2>
          <p className="mt-1 text-slate-300">
            {entry.phonetic ||
              entry.phonetics?.find((p) => p.text)?.text ||
              "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={play}
          disabled={!audioUrl}
          className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-200 hover:bg-slate-900 disabled:opacity-50"
          title={audioUrl ? "Play pronunciation" : "No audio available"}
        >
          🔊
        </button>
      </div>

      <div className="mt-5 space-y-5">
        {entry.meanings.map((m) => (
          <div key={`${entry.word}-${m.partOfSpeech}`} className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-200">
                {m.partOfSpeech}
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <ul className="space-y-2">
              {m.definitions.slice(0, 3).map((d, idx) => (
                <li key={idx} className="text-slate-100">
                  <p className="leading-relaxed">
                    <span className="text-slate-400 mr-2">•</span>
                    {d.definition}
                  </p>
                  {d.example ? (
                    <p className="mt-1 text-slate-300 italic">
                      “{d.example}”
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {entry.sourceUrls?.[0] ? (
        <a
          className="mt-5 inline-block text-sm text-slate-300 hover:text-white"
          href={entry.sourceUrls[0]}
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      ) : null}
    </div>
  );
}
