import type { ComponentType, SVGProps } from 'react';

/**
 * 动画触发方式类型
 */
export type AnimationTrigger = 'auto' | 'hover' | 'click';

/**
 * 社交图标数据接口
 */
export interface SocialIconData {
  /** 唯一标识符 */
  id: string;
  /** 图标组件 */
  component: ComponentType<SVGProps<SVGSVGElement>>;
  /** 跳转链接 */
  jumpLink: string;
  /** 无障碍标签 */
  label?: string;
}

/**
 * 动画配置接口
 */
export interface AnimationConfig {
  /** 每个图标之间的延迟时间（秒） */
  animationDelay?: number;
  /** 动画持续时间（秒） */
  animationDuration?: number;
  /** 动画触发方式 */
  animationTrigger?: AnimationTrigger;
  /** Hover 放大比例 */
  hoverScale?: number;
}

/**
 * 布局配置接口
 */
export interface LayoutConfig {
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 图标间距（像素） */
  gap?: number;
  /** 图标大小（像素） */
  iconSize?: number;
}

/**
 * 样式配置接口
 */
export interface StyleConfig {
  /** 自定义样式类 */
  className?: string;
  /** 容器自定义样式类 */
  containerClassName?: string;
}

/**
 * 完整的动画社交图标组件属性
 */
export interface AnimatedSocialIconsProps 
  extends AnimationConfig, LayoutConfig, StyleConfig {
  /** 图标数据数组 */
  icons: SocialIconData[];
}

/**
 * 预设尺寸类型
 */
export type PresetSize = 'small' | 'medium' | 'large';

/**
 * 预设变体类型
 */
export type PresetVariant = 'default' | 'bouncy' | 'smooth';

/**
 * 简化版社交图标组件属性
 */
export interface SimpleSocialIconsProps {
  /** 图标数据数组 */
  icons: SocialIconData[];
  /** 预设尺寸 */
  size?: PresetSize;
  /** 预设变体 */
  variant?: PresetVariant;
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 动画触发方式 */
  trigger?: AnimationTrigger;
  /** 自定义样式类 */
  className?: string;
}

/**
 * 尺寸配置映射
 */
export interface SizeConfigMap {
  [key: string]: {
    iconSize: number;
    gap: number;
  };
}

/**
 * 变体配置映射
 */
export interface VariantConfigMap {
  [key: string]: {
    animationDelay: number;
    hoverScale: number;
  };
}