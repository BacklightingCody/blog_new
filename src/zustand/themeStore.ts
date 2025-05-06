import { create } from 'zustand';

const themes = [
  { id: 'blue', name: '蓝色', color: '#3b82f6' },
  { id: 'red', name: '红色', color: '#ef4444' },
  { id: 'green', name: '绿色', color: '#10b981' },
  { id: 'purple', name: '紫色', color: '#8b5cf6' },
  { id: 'orange', name: '橙色', color: '#f97316' },
  { id: 'pink', name: '粉色', color: '#ec4899' },
  { id: 'teal', name: '青色', color: '#14b8a6' },
];

type ThemeStore = {
  colorTheme: string;
  setColorTheme: (themeId: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => {
  // 每次刷新初始化为随机主题
  const randomTheme = themes[Math.floor(Math.random() * themes.length)].id;
  return {
    colorTheme: randomTheme,
    setColorTheme: (themeId) => set({ colorTheme: themeId }),
  };
});

export { themes };
