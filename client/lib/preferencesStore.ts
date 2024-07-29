import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_AMOUNT: number = 3;

interface PrefenceStore {
  // profileName: string,
  lessonVolume: number,
  soundOn: boolean,
  // updateProfileName: (newName: string) => void,
  updateLessonVolume: (newVolume: number) => void,
  toggleSoundOn: () => void
}

export const usePreferencesStore = create(
  persist<PrefenceStore>(
    (set) => ({
      // profileName: 'testname',
      lessonVolume: INITIAL_AMOUNT,
      soundOn: true,
      // updateProfileName: (newName: string) => set({ profileName: newName }),
      updateLessonVolume: (newVolume: number) => set({ lessonVolume: newVolume }),
      toggleSoundOn: () => set((state: PrefenceStore) => ({ soundOn: !state.soundOn}))
    }),
    {
      name: "vocab-preferences"
    }
  )
);