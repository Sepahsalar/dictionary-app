import type { DictionaryEntry } from "../types/dictionary";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export async function fetchDefinition(word: string): Promise<DictionaryEntry[]> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return [];

  const res = await fetch(`${BASE_URL}/${encodeURIComponent(normalized)}`);

  if (res.status === 404) {
    throw new NotFoundError("Word not found");
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const data = (await res.json()) as DictionaryEntry[];
  return data;
}
