import { create } from 'zustand';

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
      background: '#f0f7ff'
    },
    dark: {
      primaryColor: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#2563eb',
      border: '#1e40af',
      cardShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.25)',
      background: '#172554'
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
      background: '#fff5f5'
    },
    dark: {
      primaryColor: '#f87171',
      secondary: '#ef4444',
      accent: '#dc2626',
      border: '#991b1b',
      cardShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.25)',
      background: '#450a0a'
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
      background: '#ecfdf5'
    },
    dark: {
      primaryColor: '#34d399',
      secondary: '#10b981',
      accent: '#059669',
      border: '#065f46',
      cardShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)',
      background: '#022c22'
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
      background: '#f5f3ff'
    },
    dark: {
      primaryColor: '#a78bfa',
      secondary: '#8b5cf6',
      accent: '#7c3aed',
      border: '#5b21b6',
      cardShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.25)',
      background: '#2e1065'
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
      background: '#fff7ed'
    },
    dark: {
      primaryColor: '#fb923c',
      secondary: '#f97316',
      accent: '#ea580c',
      border: '#9a3412',
      cardShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.25)',
      background: '#431407'
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
      background: '#fdf2f8'
    },
    dark: {
      primaryColor: '#f472b6',
      secondary: '#ec4899',
      accent: '#db2777',
      border: '#831843',
      cardShadow: '0 4px 6px -1px rgba(219, 39, 119, 0.25)',
      background: '#500724'
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
      background: '#f0fdfa'
    },
    dark: {
      primaryColor: '#2dd4bf',
      secondary: '#14b8a6',
      accent: '#0d9488',
      border: '#115e59',
      cardShadow: '0 4px 6px -1px rgba(13, 148, 136, 0.25)',
      background: '#042f2e'
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
