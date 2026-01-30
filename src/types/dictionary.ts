export type DictionaryPhonetic = {
  text?: string;
  audio?: string;
};

export type DictionaryDefinition = {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
};

export type DictionaryMeaning = {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
  antonyms?: string[];
};

export type DictionaryEntry = {
  word: string;
  phonetic?: string;
  phonetics?: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls?: string[];
};
