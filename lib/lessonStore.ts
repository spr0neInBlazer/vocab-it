import { create } from "zustand";
import { persist } from 'zustand/middleware';

const VOLUME: number = 3;

interface LessonStore {
  volume: number,
  updateVolume: (newVolume: number) => void,
  // frequency: string[]
}

const useLessonStore = create<LessonStore>(set => ({
  volume: VOLUME,
  updateVolume: (newVolume: number) => {
    set((state: LessonStore) => {
      return {...state, volume: newVolume}
    })
  }
}));
// const useLessonStore = create(
//   persist<LessonStore>(
//     (set, get) => ({
//       volume: VOLUME,
//       updateVolume: (newVolume: number) => set((state: LessonStore) => {
//         return {...state, volume: newVolume}
//       })
//     }),
//     {
//       name: 'DYNAMIC_TITLE',
//     }
//   )
// )

export default useLessonStore;