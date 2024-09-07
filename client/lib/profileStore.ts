import { create } from "zustand";

interface ProfileSlice {
  username: string,
  isEditUsername: boolean,
  isEditWordAmount: boolean,
  isAddVocab: boolean,
  isAddWord: boolean,
  isEditWord: boolean,
  isEditVocabTitle: boolean,
  setUsername: (username: string) => void,
  toggleIsEditUsername: () => void,
  toggleIsEditWordAmount: () => void,
  toggleIsAddVocab: () => void,
  toggleIsAddWord: () => void,
  toggleIsEditWord: () => void,
  toggleIsEditVocabTitle: () => void
}

const useProfileStore = create<ProfileSlice>()(set => ({
  username: '',
  isEditUsername: false,
  isEditWordAmount: false,
  isAddVocab: false,
  isAddWord: false,
  isEditWord: false,
  isEditVocabTitle: false,
  setUsername: (username) => set(() => ({ username })),
  toggleIsEditUsername: () => set(state => ({ isEditUsername: !state.isEditUsername })),
  toggleIsEditWordAmount: () => set(state => ({ isEditWordAmount: !state.isEditWordAmount })),
  toggleIsAddVocab: () => set(state => ({ isAddVocab: !state.isAddVocab })),
  toggleIsAddWord: () => set(state => ({ isAddWord: !state.isAddWord })),
  toggleIsEditWord: () => set(state => ({ isEditWord: !state.isEditWord })),
  toggleIsEditVocabTitle: () => set(state => ({ isEditVocabTitle: !state.isEditVocabTitle}))
}))

export default useProfileStore;