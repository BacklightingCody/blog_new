'use client';
import { create } from 'zustand';

// 基础模式颜色配置
const baseColors = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
  },
  dark: {
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
  },
  eye: {
    backgroundColor: '#f3f9ee',
    textColor: '#2c3528',
  }
};

const themes = [
  {
    id: 'blue',
    name: '蓝色',
    color: '#3b82f6',
    light: {
      primaryColor: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      border: '#dbeafe',
      cardShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
      background: '#f0f7ff',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#2563eb',
      border: '#1e40af',
      cardShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.25)',
      background: '#172554',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#5096a5',
      secondary: '#6baebb',
      accent: '#90c5ce',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'red',
    name: '红色',
    color: '#ef4444',
    light: {
      primaryColor: '#ef4444',
      secondary: '#f87171',
      accent: '#fca5a5',
      border: '#fee2e2',
      cardShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.1)',
      background: '#fff5f5',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#f87171',
      secondary: '#ef4444',
      accent: '#dc2626',
      border: '#991b1b',
      cardShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.25)',
      background: '#450a0a',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#a55050',
      secondary: '#bb6b6b',
      accent: '#ce9090',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'green',
    name: '绿色',
    color: '#10b981',
    light: {
      primaryColor: '#10b981',
      secondary: '#34d399',
      accent: '#6ee7b7',
      border: '#d1fae5',
      cardShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
      background: '#ecfdf5',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#34d399',
      secondary: '#10b981',
      accent: '#059669',
      border: '#065f46',
      cardShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)',
      background: '#022c22',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#4a9d50',
      secondary: '#68b06e',
      accent: '#8cc790',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'purple',
    name: '紫色',
    color: '#8b5cf6',
    light: {
      primaryColor: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      border: '#ede9fe',
      cardShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.1)',
      background: '#f5f3ff',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#a78bfa',
      secondary: '#8b5cf6',
      accent: '#7c3aed',
      border: '#5b21b6',
      cardShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.25)',
      background: '#2e1065',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#7a6b9d',
      secondary: '#9385b3',
      accent: '#b2a7c9',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'orange',
    name: '橙色',
    color: '#f97316',
    light: {
      primaryColor: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      border: '#ffedd5',
      cardShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.1)',
      background: '#fff7ed',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#fb923c',
      secondary: '#f97316',
      accent: '#ea580c',
      border: '#9a3412',
      cardShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.25)',
      background: '#431407',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#b17d45',
      secondary: '#c6996a',
      accent: '#d8b592',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'pink',
    name: '粉色',
    color: '#ec4899',
    light: {
      primaryColor: '#ec4899',
      secondary: '#f472b6',
      accent: '#f9a8d4',
      border: '#fce7f3',
      cardShadow: '0 4px 6px -1px rgba(236, 72, 153, 0.1)',
      background: '#fdf2f8',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#f472b6',
      secondary: '#ec4899',
      accent: '#db2777',
      border: '#831843',
      cardShadow: '0 4px 6px -1px rgba(219, 39, 119, 0.25)',
      background: '#500724',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#a56b89',
      secondary: '#bb879f',
      accent: '#ceaab7',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  },
  {
    id: 'teal',
    name: '青色',
    color: '#14b8a6',
    light: {
      primaryColor: '#14b8a6',
      secondary: '#2dd4bf',
      accent: '#5eead4',
      border: '#ccfbf1',
      cardShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.1)',
      background: '#f0fdfa',
      ...baseColors.light
    },
    dark: {
      primaryColor: '#2dd4bf',
      secondary: '#14b8a6',
      accent: '#0d9488',
      border: '#115e59',
      cardShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.25)',
      background: '#042f2e',
      ...baseColors.dark
    },
    eye: {
      primaryColor: '#4a9d99',
      secondary: '#68b0ad',
      accent: '#8cc7c4',
      border: '#d5e3d0',
      cardShadow: '0 4px 6px -1px rgba(144, 185, 144, 0.15)',
      background: '#f3f9ee',
      ...baseColors.eye
    }
  }
];

type ThemeStore = {
  colorTheme: string | null;
  setColorTheme: (themeId: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  colorTheme: null,
  setColorTheme: (themeId) => set({ colorTheme: themeId }),
}));

export { themes };
