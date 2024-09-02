import { create } from "zustand";

interface AuthSlice {
  accessToken: string,
  isTokenChecked: boolean,
  setAccessToken: (token: string) => void,
  setIsTokenChecked: (to: boolean) => void,
}

export const useAuthStore = create<AuthSlice>()(set => ({
  accessToken: '',
  isTokenChecked: false,
  setAccessToken: (token: string) => set({ accessToken: token }),
  setIsTokenChecked: (to: boolean) => set({ isTokenChecked: to})
}));