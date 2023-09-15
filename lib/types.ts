export interface Word {
  word: string,
  translation: string
}

export interface Vocab {
  id: string,
  title: string,
  words?: Word[]
}