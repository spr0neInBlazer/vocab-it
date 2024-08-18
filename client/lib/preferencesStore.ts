import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_AMOUNT: number = 3;

interface PreferenceStore {
  storedUsername: string,
  lessonVolume: number,
  soundOn: boolean,
  setStoredUsername: (username: string) => void,
  updateLessonVolume: (newVolume: number) => void,
  toggleSoundOn: () => void
}

export const usePreferencesStore = create<PreferenceStore>()(
  persist(
    (set) => ({
      storedUsername: 'default',
      lessonVolume: INITIAL_AMOUNT,
      soundOn: true,
      setStoredUsername: (username: string) => set({ storedUsername: username }),
      updateLessonVolume: (newVolume: number) => set({ lessonVolume: newVolume }),
      toggleSoundOn: () => set((state: PreferenceStore) => ({ soundOn: !state.soundOn}))
    }),
    {
      name: "vocab-preferences",
      partialize: (state) => 
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['storedUsername'].includes(key))
        ),
    }
  ),
);