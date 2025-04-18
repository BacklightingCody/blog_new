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
  toggleEyeProtection: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set: any) => ({
      mode: 'light' as ThemeMode,
      color: 'blue' as ThemeColor,
      
      // 直接设置模式
      setMode: (mode: ThemeMode) => set({ mode }),
      
      // 设置主题颜色
      setColor: (color: ThemeColor) => set({ color }),
      
      // 切换深色/浅色模式
      toggleDarkMode: () => set((state: ThemeState) => {
        // 如果当前是护眼模式，则退出护眼模式
        // 由于护眼模式更接近浅色模式，所以应该切换到深色模式
        if (state.mode === 'eye-protection') {
          return { mode: 'dark' };
        }
        
        // 在浅色/深色模式间切换
        return { mode: state.mode === 'dark' ? 'light' : 'dark' };
      }),

      // 切换护眼模式
      toggleEyeProtection: () => set((state: ThemeState) => {
        // 如果当前已经是护眼模式，则关闭它，返回浅色模式
        if (state.mode === 'eye-protection') {
          return { mode: 'light' };
        }
        
        // 否则不管是深色还是浅色模式，都切换到护眼模式
        return { mode: 'eye-protection' };
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
); 