import { useMemo } from 'react';

/**
 * 封面图片Hook
 * @param imageNames 图片名称数组
 * @returns 获取随机封面图片的函数
 */
export function useCoverImage(imageNames: string[]) {
  return useMemo(() => {
    return () => {
      if (!imageNames || imageNames.length === 0) {
        return 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop';
      }
      
      const randomIndex = Math.floor(Math.random() * imageNames.length);
      const imageName = imageNames[randomIndex];
      
      // 如果是完整的URL，直接返回
      if (imageName.startsWith('http')) {
        return imageName;
      }
      
      // 否则构建本地图片路径
      return `/images/covers/${imageName}`;
    };
  }, [imageNames]);
}