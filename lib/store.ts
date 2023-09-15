import { create } from "zustand";
import { Vocab } from "./types";

interface VocabStore {
  vocabs: Vocab[] | null,
  initialFetch: () => void,
  deleteVocab: (id: string) => void,
  addVocab: (title: string) => void,
  editVocabTitle: (id: string, newTitle: string) => void
}

const useVocabStore = create<VocabStore>(set => ({
  vocabs: null,

  initialFetch: () => {
    set(state => {
      const fetchedVocabs: Vocab[] = localStorage.getItem("vocabs") ? JSON.parse(localStorage.getItem("vocabs")!) : [];
      return { vocabs: fetchedVocabs }
    })
  },

  deleteVocab: (id: string) => {
    set(state => {
      if (state.vocabs!.length === 0) {
        localStorage.removeItem("vocabs");
        return { vocabs: [] };
      } else {
        let parsedVocabs = state.vocabs!.filter((vocab) => vocab.id !== id);
        localStorage.setItem("vocabs", JSON.stringify(parsedVocabs));
        return { vocabs: parsedVocabs };
      }
    });
  },

  addVocab: (title: string) => {
    set(state => {
      const newVocabObj: Vocab = {
        id: title,
        title: title
      };
      state.vocabs!.push(newVocabObj);
      localStorage.setItem("vocabs", JSON.stringify(state.vocabs));
      return { vocabs: state.vocabs };
    })
  },

  editVocabTitle: (id: string, newTitle: string) => {
    set(state => {
      const updatedVocabs: Vocab[] = [...state.vocabs!];
      const vocabIndex = updatedVocabs.findIndex(v => v.id === id); 
      if (vocabIndex !== -1) {
        updatedVocabs[vocabIndex].title = newTitle;
        updatedVocabs[vocabIndex].id = newTitle;
        localStorage.setItem("vocabs", JSON.stringify(updatedVocabs));
        return { vocabs: updatedVocabs };
      } else {
        return { vocabs: state.vocabs}
      }
    })
  }
}));

export default useVocabStore;