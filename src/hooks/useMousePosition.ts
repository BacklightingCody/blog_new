import { useRef, useEffect } from 'react';

export function useMouseGlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.left = `${x - 75}px`;
      glow.style.top = `${y - 50}px`;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', () => {
      glow.style.left = `-9999px`;
      glow.style.top = `-9999px`;
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return { containerRef, glowRef };
}
