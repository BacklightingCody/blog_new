import { useEffect, useState } from 'react';

/**
 * 检测是否在客户端执行的 Hook
 * 用于解决 SSR/CSR 不一致问题
 */
export function useClientSide() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * 安全地访问浏览器 API 的 Hook
 */
export function useSafeWindow() {
  const isClient = useClientSide();
  
  return isClient ? window : undefined;
}

/**
 * 安全地访问 localStorage 的 Hook
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const isClient = useClientSide();

  useEffect(() => {
    if (isClient) {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          setValue(JSON.parse(stored));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    }
  }, [key, isClient]);

  const setStoredValue = (newValue: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue] as const;
}
