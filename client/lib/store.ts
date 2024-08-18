import { create } from "zustand";
import { Vocab, Word } from "./types";
import { nanoid } from 'nanoid';

export const prefix: string = "vi_";

interface VocabStore {
  vocabs: Vocab[] | [],
  setVocabs: (vocabs: Vocab[]) => void,
  addVocab: (title: string) => void,
  deleteVocab: (id: string) => void,
  editVocabTitle: (id: string, newTitle: string) => void,
  addWord: (vocabTitle: string, word: string, translation: string) => void,
  deleteWord: (vocabTitle: string, word: string) => void,
  editWord: (id: string, oldWord: string, word: string, translation: string) => void,
  importWords: (id: string, words: Word[]) => void
}

const useVocabStore = create<VocabStore>(set => ({
  vocabs: [],
  setVocabs: (vocabs: Vocab[]) => set({ vocabs }),
  
  addVocab: (title: string) => {
    set((state: VocabStore) => {
      let id = nanoid(8);
      // check if id already exists
      while (state.vocabs?.some(v => v._id === (prefix + id))) {
        id = nanoid(8);
      }
      const newVocabObj: Vocab = {
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
        const filteredVocabs = state.vocabs.filter(vocab => vocab._id !== id);
        return { vocabs: filteredVocabs };
      }
      return state;
    });
  },

  editVocabTitle: (id: string, newTitle: string) => {
    set((state: VocabStore) => {
      const vocabToEdit: Vocab | undefined = state.vocabs?.find(v => v._id === id);
      if (vocabToEdit) {
        vocabToEdit.title = newTitle;
      }
      return { ...state };
    })
  },

  addWord: (id: string, word: string, translation: string) => {
    set((state: VocabStore) => {
      const newWord: Word = {
        word: word,
        translation: translation
      }
      const updatedVocabs: Vocab[] | undefined = state.vocabs?.map(v => {
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
      const updatedVocabs: Vocab[] | undefined = state.vocabs?.map(v => {
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
      const updatedVocabs: Vocab[] | undefined = state.vocabs?.map(v => {
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
    })
  },

  importWords: (id: string, words: Word[]) => {
    set((state: VocabStore) => {
      const updatedVocabs: Vocab[] | undefined = state.vocabs?.map(v => {
        if (v._id === id) {
          return { ...v, words: [...v.words, ...words]};
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
  }
}))

// Vocab:
// {_id: title, title: vi_vocab1, words: [{w: w, t: t}]}

export default useVocabStore;