import { useRef, useCallback } from 'react';

export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const lastCall = useRef(0);

  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);

  return throttledFn;
};
