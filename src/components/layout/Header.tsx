'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import ThemeController from '../ui/ThemeController';
import { useThemeStore } from '@/zustand/themeStore';

const Header = () => {
  const [showThemeController, setShowThemeController] = useState(false);
  const { mode } = useThemeStore();

  // 根据当前模式渲染不同的图标
  const renderThemeIcon = () => {
    if (mode === 'dark') {
      // 深色模式图标 - 月亮
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      );
    } else if (mode === 'eye-protection') {
      // 护眼模式图标 - 眼睛
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      );
    } else {
      // 浅色模式图标 - 太阳
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      );
    }
  };

  return (
    <header className="relative py-4 border-b border-border-color">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Nav />
        <div className="relative">
          <button
            className="p-2 rounded-full themed-bg text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            onClick={() => setShowThemeController(!showThemeController)}
            aria-label="切换主题设置"
          >
            {renderThemeIcon()}
          </button>
          
          {showThemeController && (
            <div className="absolute right-0 mt-2 p-5 themed-card shadow-theme-card rounded-lg z-10 w-64">
              <ThemeController />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
