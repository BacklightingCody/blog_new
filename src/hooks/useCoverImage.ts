"use client"
// src/utils/useCoverImage.ts
import { useState, useEffect, useCallback } from 'react';

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
  // 仅在客户端运行时存储随机选择的图片名称
  const [randomSelectedImage, setRandomSelectedImage] = useState<string | undefined>(undefined);

  // 确保 imageNames 数组有效
  if (!ArrayOfStrings(imageNames) || imageNames.length === 0) {
    console.warn('useCoverImage: 未提供有效的图片名称列表。将返回空字符串。');
    return (_?: string) => '';
  }

  // 在客户端挂载后，首次生成一个随机图片，并存储起来
  useEffect(() => {
    if (imageNames.length > 0 && randomSelectedImage === undefined) {
      const randomIndex = Math.floor(Math.random() * imageNames.length);
      setRandomSelectedImage(imageNames[randomIndex]);
    }
  }, [imageNames, randomSelectedImage]); // 依赖 imageNames 和 randomSelectedImage

  const getCoverImage = useCallback(
    (specifiedImageName?: string): string => {
      let finalImageName: string;

      if (specifiedImageName) {
        // 如果指定了图片名称，检查它是否在可用列表中
        if (imageNames.includes(specifiedImageName)) {
          finalImageName = specifiedImageName;
        } else {
          console.warn(
            `useCoverImage: 指定的图片 "${specifiedImageName}" 不存在于可用图片列表中。将尝试返回随机选择的图片。`
          );
          // 如果指定图片不存在，则使用之前随机选择的图片，或者如果还没有，则立即随机选一个
          finalImageName = randomSelectedImage || imageNames[Math.floor(Math.random() * imageNames.length)];
        }
      } else {
        // 如果没有指定图片名称，则使用之前随机选择的图片，或者如果还没有，则立即随机选一个
        finalImageName = randomSelectedImage || imageNames[Math.floor(Math.random() * imageNames.length)];
      }

      // 如果最终还是没有图片名（例如 imageNames 为空，或者 randomSelectedImage 初始为空），返回空字符串
      if (!finalImageName) {
          return '';
      }

      return `/cover/${finalImageName}`;
    },
    [imageNames, randomSelectedImage] // 依赖 imageNames 和 randomSelectedImage
  );

  return getCoverImage;
};

// 辅助函数，确保传入的是字符串数组
function ArrayOfStrings(value: any): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export default useCoverImage;