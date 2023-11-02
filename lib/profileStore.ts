import { create } from "zustand";

interface ProfileSlice {
  isEditUsername: boolean,
  isEditWordAmount: boolean,
  isAddVocab: boolean,
  isAddWord: boolean,
  isEditWord: boolean
  toggleIsEditUsername: () => void,
  toggleIsEditWordAmount: () => void,
  toggleIsAddVocab: () => void,
  toggleIsAddWord: () => void,
  toggleIsEditWord: () => void,
}

const useProfileStore = create<ProfileSlice>()(set => ({
  isEditUsername: false,
  isEditWordAmount: false,
  isAddVocab: false,
  isAddWord: false,
  isEditWord: false,
  toggleIsEditUsername: () => set(state => ({ isEditUsername: !state.isEditUsername })),
  toggleIsEditWordAmount: () => set(state => ({ isEditWordAmount: !state.isEditWordAmount })),
  toggleIsAddVocab: () => set(state => ({ isAddVocab: !state.isAddVocab })),
  toggleIsAddWord: () => set(state => ({ isAddWord: !state.isAddWord })),
  toggleIsEditWord: () => set(state => ({ isEditWord: !state.isEditWord }))
}))

export default useProfileStore;