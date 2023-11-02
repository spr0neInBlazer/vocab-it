import { create } from "zustand";
import { Vocab2, Word } from "./types";
import { nanoid } from 'nanoid';

export const prefix: string = "vi_";

interface VocabStore {
  vocabs: Vocab2[] | null,
  initialFetch: () => void,
  addVocab: (title: string) => void,
  deleteVocab: (id: string) => void,
  editVocabTitle: (id: string, newTitle: string) => void,
  addWord: (vocabTitle: string, word: string, translation: string) => void,
  deleteWord: (vocabTitle: string, word: string) => void,
  editWord: (id: string, oldWord: string, word: string, translation: string) => void,
  // lessonVolume: number,
  // updateLessonVolume: (newVolume: number) => void,
}

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
      let id = nanoid(8);
      // check if id already exists
      while (state.vocabs?.some(v => v._id === (prefix + id))) {
        id = nanoid(8);
      }
      const newVocabObj: Vocab2 = {
        _id: (prefix + id),
        title: title,
        words: []
      };
      if (state.vocabs) {
        localStorage.setItem((prefix + id), JSON.stringify(newVocabObj));
        return { vocabs: [...state.vocabs, newVocabObj] };
      } else {
        localStorage.setItem((prefix + id), JSON.stringify(newVocabObj));
        return { vocabs: [newVocabObj] };
      }
    })
  },

  deleteVocab: (id: string) => {
    set((state: VocabStore) => {
      if (state.vocabs) {
        const filteredVocabs = state.vocabs.filter((vocab) => vocab._id !== id);
        localStorage.removeItem(id);
        return { vocabs: filteredVocabs };
      } else {
        return state;
      }
    });
  },

  editVocabTitle: (id: string, newTitle: string) => {
    set((state: VocabStore) => {
      const updatedVocabs: Vocab2[] | undefined = state.vocabs?.map(v => {
        if (v._id === id) {
          return  {...v, title: newTitle };
        }
        return v;
      })
      const vocabToEdit: Vocab2 | undefined = state.vocabs?.find(v => v._id === id);
      if (vocabToEdit) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(vocabToEdit));
      }
      return { ...state, vocabs: updatedVocabs };
    })
  },

  // update state immutably
  addWord: (id: string, word: string, translation: string) => {
    set((state: VocabStore) => {
      const newWord: Word = {
        word: word,
        translation: translation
      }
      const updatedVocabs: Vocab2[] | undefined = state.vocabs?.map(v => {
        if (v._id === id) {
          return { ...v, words: [...v.words, newWord]};
        }
        return v;
      });
      const vocabToEdit = updatedVocabs?.find(v => v._id === id);
      if (vocabToEdit) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(vocabToEdit));
      }
      return { ...state, vocabs: updatedVocabs };
    })
  },

  deleteWord: (id: string, word: string) => {
    set((state: VocabStore) => {
      const updatedVocabs: Vocab2[] | undefined = state.vocabs?.map(v => {
        if (v._id === id) {
          const updatedWords = v.words.filter(w => w.word !== word);
          return { ...v, words: updatedWords };
        }
        return v;
      });
      const vocabToEdit = updatedVocabs?.find(v => v._id === id);
      if (vocabToEdit) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(vocabToEdit));
      }
      return { ...state, vocabs: updatedVocabs };
    }) 
  },

  editWord: (id: string, oldWord: string, word: string, translation: string) => {
    set((state: VocabStore) => {
      const updatedVocabs: Vocab2[] | undefined = state.vocabs?.map(v => {
        if (v._id === id) {
          const updatedWords = v.words.map(w => {
            if (w.word === oldWord) {
              return { word, translation };
            }
            return w;
          });
          return { ...v, words: updatedWords };
        }
        return v;
      });
      const vocabToEdit = updatedVocabs?.find(v => v._id === id);
      if (vocabToEdit) {
        localStorage.removeItem(id);
        localStorage.setItem(id, JSON.stringify(vocabToEdit));
      }
      return { ...state, vocabs: updatedVocabs };
      // const vocabToEditWordIn: Vocab2 | undefined = state.vocabs?.find(v => v.title === vocabTitle);
      // if (vocabToEditWordIn) {
      //   vocabToEditWordIn.words[wordIdx].word = word;
      //   vocabToEditWordIn.words[wordIdx].translation = translation;
      //   localStorage.removeItem((prefix + vocabTitle));
      //   localStorage.setItem((prefix + vocabTitle), JSON.stringify(vocabToEditWordIn));
      // }
      // return state;
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

// Vocab:
// {_id: title, title: vi_vocab1, words: [{w: w, t: t}]}

export default useVocabStore;