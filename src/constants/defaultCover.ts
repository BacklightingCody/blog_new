/**
 * 默认封面图片名称列表
 */
export const DEFAULT_COVER_IMAGE_NAMES = [
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop'
];

/**
 * 获取随机封面图片
 */
export function getRandomCoverImage(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_COVER_IMAGE_NAMES.length);
  return DEFAULT_COVER_IMAGE_NAMES[randomIndex];
}