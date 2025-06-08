// components/ClientClerkProvider.tsx
'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useThemeStore, themes } from '@/zustand/themeStore';
import { useEffect, useState } from 'react';

export default function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  const { colorTheme } = useThemeStore();
  const [variables, setVariables] = useState<any>({
    // colorPrimary: '#2563eb',
    // colorText: '#000000',
    // colorBackground: '#ffffff',
    // colorInputBackground: '#FFFFFF',
    // colorInputText: '#1A202C',
    // colorDanger: '#EF4444',
    // colorSuccess: '#22C55E',
    // borderRadius: '0.5rem',
  });

  useEffect(() => {
    const theme = themes.find((t) => t.id === colorTheme);
    const isDarkMode = document.documentElement.classList.contains('dark');
    const themeColors = isDarkMode ? theme?.dark : theme?.light;

    if (themeColors) {
      setVariables({
        colorPrimary: themeColors.primaryColor,
        colorText: isDarkMode ? '#e2e8f0' : '#333333',
        colorBackground: themeColors.accent,
        colorInputBackground: isDarkMode ? '#1e293b' : '#FFFFFF',
        colorInputText: isDarkMode ? '#e2e8f0' : '#1A202C',
        colorDanger: '#EF4444',
        colorSuccess: '#22C55E',
        borderRadius: '0.5rem',
      });
    }
  }, [colorTheme]);

  return <ClerkProvider appearance={{ variables }}>{children}</ClerkProvider>;
}
