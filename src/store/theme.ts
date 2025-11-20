import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { config } from '@/config';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeColor = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet';
export type FestiveMode = 'none' | 'christmas' | 'newyear' | 'grayscale';

interface ThemeState {
    // Core Theme State
    mode: ThemeMode;
    color: ThemeColor;
    festive: FestiveMode;

    // Advanced UI Settings
    eyeCareMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
    lineHeight: 'compact' | 'normal' | 'relaxed';
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    enableAnimations: boolean;
    reducedMotion: boolean;

    // Actions
    setMode: (mode: ThemeMode) => void;
    setColor: (color: ThemeColor) => void;
    setFestive: (festive: FestiveMode) => void;
    toggleMode: () => void;

    // Advanced Actions
    toggleEyeCareMode: () => void;
    setEyeCareMode: (on: boolean) => void;
    setFontSize: (size: 'small' | 'medium' | 'large') => void;
    setLineHeight: (height: 'compact' | 'normal' | 'relaxed') => void;
    setBorderRadius: (radius: 'none' | 'small' | 'medium' | 'large') => void;
    toggleAnimations: () => void;
    toggleReducedMotion: () => void;
    resetTheme: () => void;
}

const defaultState = {
    mode: 'system' as ThemeMode,
    color: 'blue' as ThemeColor,
    festive: 'none' as FestiveMode,
    eyeCareMode: false,
    fontSize: 'medium' as const,
    lineHeight: 'normal' as const,
    borderRadius: 'medium' as const,
    enableAnimations: true,
    reducedMotion: false,
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setMode: (mode) => set({ mode }),
            setColor: (color) => set({ color }),
            setFestive: (festive) => set({ festive }),

            toggleMode: () => {
                const current = get().mode;
                const next = current === 'light' ? 'dark' : current === 'dark' ? 'light' : 'dark'; // System defaults to dark for toggle if unknown? Or maybe just cycle.
                // Better logic: if system is dark, toggle to light.
                set({ mode: next });
            },

            toggleEyeCareMode: () => set((state) => ({ eyeCareMode: !state.eyeCareMode })),
            setEyeCareMode: (on) => set({ eyeCareMode: on }),

            setFontSize: (fontSize) => set({ fontSize }),
            setLineHeight: (lineHeight) => set({ lineHeight }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),

            toggleAnimations: () => set((state) => ({ enableAnimations: !state.enableAnimations })),
            toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),

            resetTheme: () => set(defaultState),
        }),
        {
            name: 'theme-storage',
        }
    )
);

// Export hooks for convenience if needed, or just use useThemeStore directly
export const useTheme = () => useThemeStore((state) => ({
    mode: state.mode,
    color: state.color,
    festive: state.festive,
    setMode: state.setMode,
    setColor: state.setColor,
    setFestive: state.setFestive,
}));
