'use client'
import React from 'react';
import { useThemeStore, ThemeColor, ThemeMode } from '@/zustand/themeStore';
import Switch from './Switch';

interface ThemeControllerProps {
  className?: string;
}

const themeColors: ThemeColor[] = ['red', 'blue', 'pink', 'purple', 'cyan', 'orange', 'yellow'];

export function ThemeController({ className = '' }: ThemeControllerProps) {
  const { mode, color, setMode, setColor, toggleDarkMode } = useThemeStore();

  const colorNames = {
    red: '红色',
    blue: '蓝色',
    pink: '粉色',
    purple: '紫色',
    cyan: '青色',
    orange: '橙色',
    yellow: '黄色',
  };

  const modeLabels = {
    light: '浅色模式',
    dark: '深色模式',
    'eye-protection': '护眼模式',
  };

  return (
    <div className={`theme-controller ${className}`}>
      <div className="flex flex-col space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">深色模式</span>
            <Switch
              checked={mode === 'dark'}
              onChange={toggleDarkMode}
              activeTrackColor="var(--primary-color)"
              ariaLabel="切换深色模式"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">护眼模式</span>
            <Switch
              checked={mode === 'eye-protection'}
              onChange={(checked) => setMode(checked ? 'eye-protection' : 'light')}
              activeTrackColor="#4a9d50"
              ariaLabel="切换护眼模式"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium mb-3">主题颜色</span>
          <div className="grid grid-cols-7 gap-3">
            {themeColors.map((themeColor) => (
              <button
                key={themeColor}
                className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                  themeColor === color ? 'ring-2 ring-offset-2 ring-opacity-50 ring-white dark:ring-gray-800' : ''
                }`}
                style={{
                  backgroundColor: `var(--${themeColor}-color)`,
                  boxShadow: themeColor === color ? '0 0 0 2px var(--primary-color)' : 'none',
                  transform: themeColor === color ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={() => setColor(themeColor)}
                aria-label={`设置主题颜色为${colorNames[themeColor]}`}
                title={colorNames[themeColor]}
              />
            ))}
          </div>
          
          <div className="mt-2 pt-2 border-t border-border-color">
            <p className="text-xs text-text opacity-80 mt-1">
              当前主题: {colorNames[color]} {modeLabels[mode]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeController; 