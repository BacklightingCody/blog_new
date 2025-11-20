import { ThemeColor } from '@/store/theme';

export const themes: Record<ThemeColor, { light: string; dark: string }> = {
    red: {
        light: '0 72% 51%', // Red-600
        dark: '0 72% 51%',
    },
    orange: {
        light: '24 96% 53%', // Orange-500
        dark: '24 96% 53%',
    },
    yellow: {
        light: '48 96% 53%', // Yellow-500 (adjusted)
        dark: '48 96% 53%',
    },
    green: {
        light: '142 76% 36%', // Green-600
        dark: '142 70% 50%',
    },
    cyan: {
        light: '189 94% 43%', // Cyan-500
        dark: '189 94% 43%',
    },
    blue: {
        light: '221 83% 53%', // Blue-500
        dark: '217 91% 60%',
    },
    violet: {
        light: '262 83% 58%', // Violet-500
        dark: '262 83% 58%',
    },
};

export const festiveThemes = {
    christmas: {
        primary: '0 72% 51%', // Red
        secondary: '142 76% 36%', // Green
    },
    newyear: {
        primary: '0 72% 51%', // Red
        secondary: '48 96% 53%', // Gold/Yellow
    },
};
