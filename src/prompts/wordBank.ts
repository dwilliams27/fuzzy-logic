export interface WordBank {
  common: Word[];
  uncommon: Word[];
  rare: Word[];
  bankType: WordType;
}
export interface Word {
  word: string;
  type: WordType;
  rank: WordRank;
}
export enum WordType {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
}
export enum WordRank {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
}
export interface WordBankTypedResponse {
  nouns: { most: string[], medium: string[], least: string[] };
  verbs: { most: string[], medium: string[], least: string[] };
  adjectives: { most: string[], medium: string[], least: string[] };
}

export const WB_SYSTEM_PROMPT_RAW = `
  You will be given the text of a conversation, and a few possible next responses.
  The repsonses will have specific words missing and replaced with [VERB], [NOUN], and
  [ADJECTIVE]. You must come up with possible replacements for each of these words.
  Your replacement word ideas should be separated into three categories, based on how
  presuasive and forceful the words are. You must give at least {NUM_WORDS} words per
  type. Your response will be a structured JSON object of the form:
  { nouns: { most: ["noun1", "noun2"], medium: ["noun3", "noun4"], least: ["noun5", "noun6"] }, verbs: { most: ["verb1", "verb2"], medium: ["verb3", "verb4"], least: ["verb5", "verb6"] }, adjectives: { most: ["adjective1", "adjective2"], medium: ["adjective3", "adjective4"], least: ["adjective5", "adjective6"] }  }
`;
export const WB_SYSTEM_PROMPT_VARIABLES = ['NUM_WORDS'] as const;
