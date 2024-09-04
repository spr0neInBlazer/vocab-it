export interface Word {
  _id: string,
  word: string,
  translation: string,
  progress?: number,
  trained: number,
  isGuessCorrect?: boolean
}

export interface Vocab {
  _id: string,
  title: string,
  words: Word[]
}

export interface VocabStore {
  vocabs: Vocab[] | null,
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
  _id: string,
  word: string,
  translation: string,
  userAnswer: string
}

export type CheckSingleEditFunction = () => boolean;

export interface CustomPayload {
  "UserInfo": {
    "_id": string,
    "username": string,
    "roles": number[]
  },
  "iat": number,
  "exp": number
}
