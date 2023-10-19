import { create } from "zustand";
import { Vocab2, Word } from "./types";

export const prefix: string = "vi_";

interface VocabStore {
  vocabs: Vocab2[] | null,
  initialFetch: () => void,
  addVocab: (title: string) => void,
  deleteVocab: (title: string) => void,
  editVocabTitle: (oldTitle: string, newTitle: string) => void,
  addWord: (vocabTitle: string, word: string, translation: string) => void,
  deleteWord: (vocabTitle: string, word: string) => void,
  editWord: (vocabTitle: string, wordIdx: number, word: string, translation: string) => void,
  // lessonVolume: number,
  // updateLessonVolume: (newVolume: number) => void,
}

const INITIAL_AMOUNT: number = 3;

const useVocabStore = create<VocabStore>(set => ({
  vocabs: null,
  initialFetch: () => {
    set(() => {
      const parsedVocabs: Vocab2[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          const vocab = JSON.parse(localStorage.getItem(key)!);
          parsedVocabs.push(vocab);
        }
      }
      return { vocabs: parsedVocabs }
    })
  },
  
  addVocab: (title: string) => {
    set((state: VocabStore) => {
      const newVocabObj: Vocab2 = {
        title: title,
        words: []
      };
      if (state.vocabs) {
        state.vocabs.push(newVocabObj);
        localStorage.setItem((prefix + title), JSON.stringify(newVocabObj));
        return { vocabs: state.vocabs };
      } else {
        localStorage.setItem((prefix + title), JSON.stringify(newVocabObj));
        return { vocabs: [newVocabObj] };
      }
    })
  },

  deleteVocab: (title: string) => {
    set((state: VocabStore) => {
      if (state.vocabs) {
        const filteredVocabs = state.vocabs.filter((vocab) => vocab.title !== title);
        localStorage.removeItem((prefix + title));
        return { vocabs: filteredVocabs };
      } else {
        return state;
      }
    });
  },

  editVocabTitle: (oldTitle: string, newTitle: string) => {
    set((state: VocabStore) => {
      const vocabToEdit: Vocab2 | undefined = state.vocabs?.find(v => v.title === oldTitle);
      if (vocabToEdit) {
        vocabToEdit.title = newTitle;
        localStorage.removeItem((prefix + oldTitle));
        localStorage.setItem((prefix + newTitle), JSON.stringify(vocabToEdit));
      }
      return state;
    })
  },

  addWord: (vocabTitle: string, word: string, translation: string) => {
    set((state: VocabStore) => {
      const newWord: Word = {
        word: word,
        translation: translation
      }
      const vocabToAddWordTo = state.vocabs?.find(v => v.title === vocabTitle);
      if (vocabToAddWordTo) {
        vocabToAddWordTo.words.push(newWord);
        localStorage.removeItem((prefix + vocabTitle));
        localStorage.setItem((prefix + vocabTitle), JSON.stringify(vocabToAddWordTo));
      }
      return state;
    })
  },

  deleteWord: (vocabTitle: string, word: string) => {
    set((state: VocabStore) => {
      const vocabToDeleteWordFrom: Vocab2 | undefined = state.vocabs?.find(v => v.title === vocabTitle);
      if (vocabToDeleteWordFrom) {
        const updatedWords = vocabToDeleteWordFrom.words.filter(w => w.word !== word);
        vocabToDeleteWordFrom.words = [...updatedWords];
        const updatedVocabs = state.vocabs?.filter(v => v.title !== vocabTitle);
        updatedVocabs?.push(vocabToDeleteWordFrom);
        localStorage.removeItem((prefix + vocabTitle));
        localStorage.setItem((prefix + vocabTitle), JSON.stringify(vocabToDeleteWordFrom));
        return { vocabs: updatedVocabs };
      }
      return state;
    }) 
  },

  editWord: (vocabTitle: string, wordIdx: number, word: string, translation: string) => {
    set((state: VocabStore) => {
      const vocabToEditWordIn: Vocab2 | undefined = state.vocabs?.find(v => v.title === vocabTitle);
      if (vocabToEditWordIn) {
        vocabToEditWordIn.words[wordIdx].word = word;
        vocabToEditWordIn.words[wordIdx].translation = translation;
        localStorage.removeItem((prefix + vocabTitle));
        localStorage.setItem((prefix + vocabTitle), JSON.stringify(vocabToEditWordIn));
      }
      return state;
    })
  },

  // lessonVolume: settingsExist ? JSON.parse(settingsExist).lessonVolume : INITIAL_AMOUNT,
  // updateLessonVolume: (newVolume: number) => {
  //   set((state: VocabStore) => {
  //     const settingsExist = localStorage.getItem("vocab-it");
  //     if (settingsExist) {
  //       localStorage.removeItem("vocab-it")
  //     }
  //     localStorage.setItem("vocab-it", JSON.stringify({ lessonVolume: newVolume }));
  //     return {...state, lessonVolume: newVolume};
  //   })
  // },
}))

// {title: vi_vocab1, words: [{w: w, t: t}]}
// {title: vi_vocab2, words: [{w: w, t: t}]}
// {title: vi_vocab3, words: [{w: w, t: t}]}

export default useVocabStore;