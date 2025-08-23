'use client';

import React from 'react';
import AnimatedSocialIcons, { type SocialIconData, type AnimationTrigger } from './animated-social-icons';

// 简化版组件属性
export interface SimpleSocialIconsProps {
  icons: SocialIconData[];
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'bouncy' | 'smooth';
  direction?: 'horizontal' | 'vertical';
  trigger?: AnimationTrigger;
  className?: string;
}

// 预设配置
const sizeConfig = {
  small: { iconSize: 32, gap: 12 },
  medium: { iconSize: 50, gap: 16 },
  large: { iconSize: 64, gap: 20 }
};

const variantConfig = {
  default: {
    animationDelay: 0.15,
    hoverScale: 1.05
  },
  bouncy: {
    animationDelay: 0.25,
    hoverScale: 1.15
  },
  smooth: {
    animationDelay: 0.1,
    hoverScale: 1.08
  }
};

const SimpleSocialIcons: React.FC<SimpleSocialIconsProps> = ({
  icons,
  size = 'medium',
  variant = 'default',
  direction = 'horizontal',
  trigger = 'auto',
  className = ''
}) => {
  const sizeSettings = sizeConfig[size];
  const variantSettings = variantConfig[variant];

  return (
    <AnimatedSocialIcons
      icons={icons}
      direction={direction}
      className={className}
      animationTrigger={trigger}
      {...sizeSettings}
      {...variantSettings}
    />
  );
};

export default SimpleSocialIcons;