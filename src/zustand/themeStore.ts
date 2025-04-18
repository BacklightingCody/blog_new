import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'eye-protection';
export type ThemeColor = 'red' | 'blue' | 'pink' | 'purple' | 'cyan' | 'orange' | 'yellow';

interface ThemeState {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set: any) => ({
      mode: 'light' as ThemeMode,
      color: 'blue' as ThemeColor,
      setMode: (mode: ThemeMode) => set({ mode }),
      setColor: (color: ThemeColor) => set({ color }),
      toggleDarkMode: () => set((state: ThemeState) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'theme-storage',
    }
  )
); 