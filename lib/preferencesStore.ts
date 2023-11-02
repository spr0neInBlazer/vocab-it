import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_AMOUNT: number = 3;

interface PrefenceStore {
  profileName: string,
  lessonVolume: number,
  updateProfileName: (newName: string) => void,
  updateLessonVolume: (newVolume: number) => void,
}

export const usePreferencesStore = create(
  persist<PrefenceStore>(
    (set) => ({
      profileName: 'testname',
      lessonVolume: INITIAL_AMOUNT,
      updateProfileName: (newName: string) => set({ profileName: newName }),
      updateLessonVolume: (newVolume: number) => set({ lessonVolume: newVolume }),
    }),
    {
      name: "vocab-preferences"
    }
  )
);