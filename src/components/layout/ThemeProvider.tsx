'use client'
import { ReactNode, useEffect } from 'react';
import { useThemeStore } from '@/zustand/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

// 颜色映射表
const colorMap = {
  red: {
    light: '#ff3d71',
    dark: '#ff4d7e'
  },
  blue: {
    light: '#3e63dd',
    dark: '#5a7bfc'
  },
  pink: {
    light: '#d6409f',
    dark: '#e773b9'
  },
  purple: {
    light: '#7c3aed',
    dark: '#9061f9'
  },
  cyan: {
    light: '#0ca4a5',
    dark: '#25b0b0'
  },
  orange: {
    light: '#ff7849',
    dark: '#ff925e'
  },
  yellow: {
    light: '#ffb340',
    dark: '#ffc857'
  }
};

// 眼保护模式颜色
const eyeProtectionColors = {
  background: '#f3f9ee',
  text: '#2c3528',
  accent: '#4a9d50'
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode, color } = useThemeStore();

  useEffect(() => {
    // 移除之前的所有模式类
    document.documentElement.classList.remove('light-mode', 'dark-mode', 'eye-protection-mode', 'dark');
    
    // 添加当前模式类
    document.documentElement.classList.add(`${mode}-mode`);
    
    // 为Tailwind添加dark类
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // 设置颜色变量
    if (mode === 'eye-protection') {
      document.documentElement.style.setProperty('--background-color', eyeProtectionColors.background);
      document.documentElement.style.setProperty('--text-color', eyeProtectionColors.text);
      document.documentElement.style.setProperty('--primary-color', eyeProtectionColors.accent);
    } else {
      const themeColor = colorMap[color];
      document.documentElement.style.setProperty('--primary-color', themeColor[mode]);
      
      if (mode === 'dark') {
        document.documentElement.style.setProperty('--background-color', '#0f172a');
        document.documentElement.style.setProperty('--text-color', '#e2e8f0');
      } else {
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#333333');
      }
    }
  }, [mode, color]);

  return <>{children}</>;
}

export default ThemeProvider; 