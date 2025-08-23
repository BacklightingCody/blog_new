import { useEffect, useState } from 'react';
import { useThrottle } from './useThrottle'; 

export const useScrollPosition = (wait = 16) => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  const updateScroll = useThrottle(() => {
    if (typeof window !== 'undefined') {
      setScroll({
        x: window.scrollX,
        y: window.scrollY,
      });
    }
  }, wait);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      updateScroll();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScroll]);

  return isClient ? scroll : { x: 0, y: 0 };
};
