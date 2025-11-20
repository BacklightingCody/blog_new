'use client';

import * as React from 'react';
import { useThemeStore } from '@/store/theme';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { color, festive } = useThemeStore();

    // Sync Zustand state with DOM classes
    React.useEffect(() => {
        const root = document.documentElement;

        // Remove all existing theme classes
        const themeClasses = [
            'theme-red', 'theme-orange', 'theme-yellow', 'theme-green',
            'theme-cyan', 'theme-blue', 'theme-violet', 'theme-pink', 'theme-teal'
        ];
        root.classList.remove(...themeClasses);

        // Add current theme class
        // Map store color names to CSS class names if they differ
        // Store: red, orange, yellow, green, cyan, blue, violet
        // CSS: red, orange, yellow, green, teal (cyan?), blue, purple (violet?), pink

        let themeClass = `theme-${color}`;
        if (color === 'cyan') themeClass = 'theme-teal'; // Mapping cyan to teal if that's what CSS uses
        if (color === 'violet') themeClass = 'theme-purple'; // Mapping violet to purple

        root.classList.add(themeClass);

        // Handle festive modes
        if (festive === 'grayscale') {
            root.style.filter = 'grayscale(100%)';
        } else {
            root.style.filter = 'none';
        }

        // We could add festive classes here too if needed
        // if (festive !== 'none') root.classList.add(`festive-${festive}`);

    }, [color, festive]);

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
}
