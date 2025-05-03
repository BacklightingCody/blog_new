import { useState, useEffect, useRef, useCallback } from "react";
import { useThrottle } from "@/hooks";

export function useMousePosition() {
  const [mousePos, setMousePos] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const ref = useRef<HTMLDivElement>(null);

  // Define handleMouseMove at top level
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  }, []);

  // Apply throttle at top level
  // const handleMouseMove = useThrottle(handleMouseMoveRaw, 16); // 约 60fps

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseLeave = () => {
      setMousePos({ x: null, y: null });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove]); // Add handleMouseMove as dependency

  return [ref, mousePos] as const;
}