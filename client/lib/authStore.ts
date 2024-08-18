import { create } from "zustand";

interface AuthSlice {
  accessToken: string,
  // storedUsername: string,
  setAccessToken: (token: string) => void,
  // setStoredUsername: (username: string) => void,
}

export const useAuthStore = create<AuthSlice>()(set => ({
  accessToken: '',
  // storedUsername: '',
  setAccessToken: (token: string) => set({ accessToken: token }),
  // setStoredUsername: (username: string) => set({ storedUsername: username }),
}));