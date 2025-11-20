'use client';

import { useThemeStore } from '@/store/theme';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Background() {
    const { color, mode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // We can use the CSS variables we set in ThemeProvider
    // or map colors directly here for more complex canvas/SVG animations.
    // For now, a simple animated gradient blob approach.

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-background transition-colors duration-500" />

            {/* Gradient Blob 1 */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-20 blur-[100px]"
                style={{
                    background: `radial-gradient(circle, var(--primary-light) 0%, transparent 70%)`
                }}
            />

            {/* Gradient Blob 2 */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px]"
                style={{
                    background: `radial-gradient(circle, var(--primary-dark) 0%, transparent 70%)`
                }}
            />

            {/* Noise overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: 'url("/noise.png")' }} />
        </div>
    );
}
