import { useEffect, useState } from 'react';
import { useThrottle } from './useThrottle'; 

export const useScrollPosition = (wait = 16) => {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  const updateScroll = useThrottle(() => {
    setScroll({
      x: window.scrollX,
      y: window.scrollY,
    });
  }, wait);

  useEffect(() => {
    const handleScroll = () => {
      updateScroll();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScroll]);

  return scroll;
};
