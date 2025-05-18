import { useState, useRef, useEffect, RefCallback, useMemo, useLayoutEffect } from 'react';

interface UnderlineOptions {
  activeKey: string | null;
  containerRef?: React.RefObject<HTMLElement>;
  height?: number;
  color?: string;
  animationDuration?: number;
  animationDelay?: number;
  insetX?: number;
  bottomOffset?: number;
}

interface BlockOptions {
  activeKey: string | null;
  containerRef?: React.RefObject<HTMLElement>;
  backgroundColor?: string;
  opacity?: number;
  hoverOpacity?: number;
  animationDuration?: number;
  animationDelay?: number;
  borderRadius?: number;
}

interface UnderlineStyle {
  position: 'absolute';
  pointerEvents: 'none';
  opacity: number;
  left: number;
  width: number | string;
  height: number | string;
  bottom: number;
  backgroundImage: string;
  transition: string;
  transform: string;
  transformOrigin: string;
}

interface BlockStyle {
  position: 'absolute';
  pointerEvents: 'none';
  opacity: number;
  left: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderRadius: number;
  transition: string;
  transform: string;
  transformOrigin: string;
}

export function useSliderUnderline<T extends HTMLElement>({
  activeKey,
  containerRef,
  height = 2,
  color = 'var(--theme-primary)',
  animationDuration = 150,
  animationDelay = 0,
  insetX = 4,
  bottomOffset = -1,
}: UnderlineOptions) {
  const itemRefs = useRef<Record<string, T | null>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [gradientPosition, setGradientPosition] = useState(0);

  const getItemRef = (key: string): RefCallback<T> => (el) => {
    if (el) {
      itemRefs.current[key] = el;
      if (mountedRef.current && key === activeKey) {
        setIsInitialized(true);
        updateSliderWidth(el);
      }
    } else {
      delete itemRefs.current[key];
    }
  };

  const updateSliderWidth = (el: T) => {
    const container = containerRef?.current ?? el.parentElement;
    if (!container) return;

    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setSliderWidth(rect.width - insetX * 2);
  };

  // 添加动画效果
  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 2000; // 2秒一个循环
      setGradientPosition(progress % 1);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const sliderStyle = useMemo(() => {
    if (!activeKey || !itemRefs.current[activeKey]) {
      return {
        opacity: 0,
        left: 0,
        width: 0,
        height: `${height}px`,
        bottom: bottomOffset,
        backgroundImage: `linear-gradient(to right, transparent, ${color}, transparent)`,
        transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
        transform: 'none',
        transformOrigin: '50% 50% 0px',
      } as UnderlineStyle;
    }

    const el = itemRefs.current[activeKey];
    const container = containerRef?.current ?? el.parentElement;
    if (!container) {
      return {
        opacity: 0,
        left: 0,
        width: 0,
        height: `${height}px`,
        bottom: bottomOffset,
        backgroundImage: `linear-gradient(to right, transparent, ${color}, transparent)`,
        transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
        transform: 'none',
        transformOrigin: '50% 50% 0px',
      } as UnderlineStyle;
    }

    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // 计算渐变位置
    const gradientStart = (gradientPosition - 0.5) * 2;
    const gradientEnd = gradientStart + 1;

    return {
      opacity: 1,
      left: rect.left - containerRect.left + insetX,
      width: `${sliderWidth}px`,
      height: `${height}px`,
      bottom: bottomOffset,
      backgroundImage: `linear-gradient(to right, 
        transparent ${gradientStart * 100}%,
        ${color} ${(gradientStart + 0.2) * 100}%,
        ${color} ${(gradientEnd - 0.2) * 100}%,
        transparent ${gradientEnd * 100}%
      )`,
      transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
      transform: 'none',
      transformOrigin: '50% 50% 0px',
    } as UnderlineStyle;
  }, [
    activeKey,
    containerRef,
    height,
    color,
    animationDuration,
    animationDelay,
    insetX,
    bottomOffset,
    sliderWidth,
    gradientPosition,
  ]);

  useLayoutEffect(() => {
    mountedRef.current = true;
    const updateSlider = () => {
      if (activeKey && itemRefs.current[activeKey]) {
        setIsInitialized(true);
        updateSliderWidth(itemRefs.current[activeKey]!);
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    window.addEventListener('scroll', updateSlider);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', updateSlider);
      window.removeEventListener('scroll', updateSlider);
    };
  }, [activeKey]);

  // 监听路由变化
  useEffect(() => {
    if (activeKey && itemRefs.current[activeKey]) {
      updateSliderWidth(itemRefs.current[activeKey]!);
    }
  }, [activeKey]);

  return {
    sliderStyle: {
      ...sliderStyle,
      opacity: isInitialized ? sliderStyle.opacity : 0,
    },
    getItemRef,
  };
}

export function useSliderBlock<T extends HTMLElement>({
  activeKey,
  containerRef,
  backgroundColor = 'var(--theme-primary)',
  opacity = 0.1,
  hoverOpacity = 0.2,
  animationDuration = 150,
  animationDelay = 0,
  borderRadius = 4,
}: BlockOptions) {
  const itemRefs = useRef<Record<string, T | null>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(false);

  const getItemRef = (key: string): RefCallback<T> => (el) => {
    if (el) {
      itemRefs.current[key] = el;
      if (mountedRef.current && key === activeKey) {
        setIsInitialized(true);
      }
    } else {
      delete itemRefs.current[key];
    }
  };

  const sliderStyle = useMemo(() => {
    if (!activeKey || !itemRefs.current[activeKey]) {
      return {
        opacity: 0,
        left: 0,
        width: 0,
        height: 0,
        backgroundColor,
        borderRadius,
        transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
        transform: 'none',
        transformOrigin: '50% 50% 0px',
      } as BlockStyle;
    }

    const el = itemRefs.current[activeKey];
    const container = containerRef?.current ?? el.parentElement;
    if (!container) {
      return {
        opacity: 0,
        left: 0,
        width: 0,
        height: 0,
        backgroundColor,
        borderRadius,
        transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
        transform: 'none',
        transformOrigin: '50% 50% 0px',
      } as BlockStyle;
    }

    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      opacity: 1,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      backgroundColor,
      borderRadius,
      transition: `all ${animationDuration}ms ease ${animationDelay}ms`,
      transform: 'none',
      transformOrigin: '50% 50% 0px',
    } as BlockStyle;
  }, [
    activeKey,
    containerRef,
    backgroundColor,
    borderRadius,
    animationDuration,
    animationDelay,
  ]);

  useLayoutEffect(() => {
    mountedRef.current = true;
    const updateSlider = () => {
      if (activeKey && itemRefs.current[activeKey]) {
        setIsInitialized(true);
      }
    };

    updateSlider();
    window.addEventListener('resize', updateSlider);
    window.addEventListener('scroll', updateSlider);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', updateSlider);
      window.removeEventListener('scroll', updateSlider);
    };
  }, [activeKey]);

  return {
    sliderStyle: {
      ...sliderStyle,
      opacity: isInitialized ? sliderStyle.opacity : 0,
    },
    getItemRef,
  };
}