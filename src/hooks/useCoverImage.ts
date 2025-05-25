"use client"
// src/utils/useCoverImage.ts
import { useMemo } from 'react';

/**
 * 一个 React Hook，用于获取默认 Cover 图片。
 * 允许随机选择或指定图片名称。
 * 图片应存放在 public/cover 目录下，并通过导入的常量列表获取名称。
 *
 * @param {string[]} imageNames - 可用的图片文件名数组，例如: ['default_cover_01.jpg', 'nature_cover_02.png']
 * @returns {(specifiedImageName?: string) => string} 一个函数，接收一个可选的图片文件名作为参数。
 * 如果传入文件名，则返回指定图片的路径；
 * 如果未传入文件名，则随机返回一个图片的路径。
 */
const useCoverImage = (imageNames: string[]): ((specifiedImageName?: string) => string) => {
  // 使用 useMemo 缓存随机选择的图片
  const randomImage = useMemo(() => {
    if (!ArrayOfStrings(imageNames) || imageNames.length === 0) {
      console.warn('useCoverImage: 未提供有效的图片名称列表。将返回空字符串。');
      return '';
    }
    const randomIndex = Math.floor(Math.random() * imageNames.length);
    return imageNames[randomIndex];
  }, [imageNames]);

  // 使用 useMemo 缓存 getCoverImage 函数
  return useMemo(() => {
    return (specifiedImageName?: string): string => {
      if (!ArrayOfStrings(imageNames) || imageNames.length === 0) {
        return '';
      }

      let finalImageName: string;

      if (specifiedImageName) {
        if (imageNames.includes(specifiedImageName)) {
          finalImageName = specifiedImageName;
        } else {
          console.warn(
            `useCoverImage: 指定的图片 "${specifiedImageName}" 不存在于可用图片列表中。将使用随机选择的图片。`
          );
          finalImageName = randomImage;
        }
      } else {
        finalImageName = randomImage;
      }

      return finalImageName ? `/cover/${finalImageName}` : '';
    };
  }, [imageNames, randomImage]);
};

// 辅助函数，确保传入的是字符串数组
function ArrayOfStrings(value: any): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export default useCoverImage;