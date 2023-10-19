import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_AMOUNT: number = 3;

interface PrefenceStore {
  lessonVolume: number,
  updateLessonVolume: (newVolume: number) => void,
}

export const usePreferencesStore = create(
  persist<PrefenceStore>(
    (set) => ({
      lessonVolume: INITIAL_AMOUNT,
      updateLessonVolume: (newVolume: number) => set({ lessonVolume: newVolume }),
    }),
    {
      name: "vocab-preferences"
    }
  )
);