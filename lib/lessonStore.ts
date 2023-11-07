import { create } from "zustand";

const VOLUME: number = 3;

interface LessonStore {
  volume: number,
  updateVolume: (newVolume: number) => void,
}

const useLessonStore = create<LessonStore>(set => ({
  volume: VOLUME,
  updateVolume: (newVolume: number) => {
    set((state: LessonStore) => {
      return {...state, volume: newVolume}
    })
  }
}));

export default useLessonStore;