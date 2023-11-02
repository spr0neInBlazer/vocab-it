export interface Word {
  word: string,
  translation: string
}

export interface Vocab {
  id: string,
  title: string,
  // words?: Word[]
}

export interface Vocab2 {
  _id: string,
  title: string,
  words: Word[]
}

export interface VocabStore {
  vocabs: Vocab2[] | null,
  initialFetch: () => void,
  deleteVocab: (id: string) => void,
  addVocab: (title: string) => void,
  editVocabTitle: (id: string, newTitle: string) => void,
}

export interface WordStore {
  title: string,
  words: Word[],
  initialWordsFetch: (title: string) => void,
  addWord: (word: string, translation: string) => void,
}

export interface Answer {
  userAnswer: string,
  isCorrect: boolean,
  word?: string,
  correctAnswer?: string
}

export type CheckSingleEditFunction = () => boolean;