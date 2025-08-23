'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/features/icon';
import type { ComponentType, SVGProps } from 'react';

// 图标数据接口
export interface SocialIconData {
  id: string;
  component: ComponentType<SVGProps<SVGSVGElement>>;
  jumpLink: string;
  label?: string;
}

// 动画触发方式类型
export type AnimationTrigger = 'auto' | 'hover' | 'click';

// 组件属性接口
export interface AnimatedSocialIconsProps {
  icons: SocialIconData[];
  iconSize?: number;
  className?: string;
  containerClassName?: string;
  // 动画配置
  animationDelay?: number; // 每个图标之间的延迟时间（秒）
  animationDuration?: number; // 动画持续时间（秒）
  animationTrigger?: AnimationTrigger; // 动画触发方式
  // 布局配置
  direction?: 'horizontal' | 'vertical';
  gap?: number; // 图标间距
  // 交互配置
  hoverScale?: number; // Hover 放大比例（已内置到hover效果中）
}

// 从上方掉落回弹动画变体
const dropBounceVariants = {
  hidden: { 
    y: -100, // 从上方开始
    opacity: 0,
    scale: 1
  },
  visible: (custom: { delay: number; iconSize: number }) => {
    const dropDistance = custom.iconSize / 2; // 掉落到图标高度一半的位置
    return {
      y: [-100, dropDistance, 0], // 从上方 -> 掉落点 -> 正常位置
      opacity: [0, 1, 1],
      scale: [1, 0.9, 1], // 轻微压缩效果模拟撞击
      transition: {
        delay: custom.delay,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1], // 回弹缓动效果
        times: [0, 0.7, 1] // 70%时间用于掉落，30%时间用于回弹
      }
    };
  }
};

// 简单的hover效果变体（不再需要循环动画）
const hoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.1,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

const AnimatedSocialIcons: React.FC<AnimatedSocialIconsProps> = ({
  icons,
  iconSize = 50,
  className = '',
  containerClassName = '',
  animationDelay = 0.2,
  animationDuration = 0.6,
  animationTrigger = 'auto',
  direction = 'horizontal',
  gap = 16,
  hoverScale = 1.1
}) => {
  const [hasTriggered, setHasTriggered] = React.useState(false);
  const [shouldAnimate, setShouldAnimate] = React.useState(animationTrigger === 'auto');

  // 自动执行动画（仅执行一次）
  React.useEffect(() => {
    if (animationTrigger === 'auto' && !hasTriggered) {
      setShouldAnimate(true);
      setHasTriggered(true);
    }
  }, [animationTrigger, hasTriggered]);

  // 处理动画触发
  const handleTriggerAnimation = () => {
    if (animationTrigger === 'click') {
      setShouldAnimate(true);
      // 动画完成后重置状态，允许再次触发
      setTimeout(() => {
        setShouldAnimate(false);
      }, (icons.length * animationDelay + animationDuration) * 1000);
    }
  };

  const containerClass = direction === 'horizontal' 
    ? `flex flex-row items-center justify-center`
    : `flex flex-col items-center justify-center`;

  const gapClass = direction === 'horizontal' 
    ? `gap-${Math.floor(gap / 4)}` 
    : `space-y-${Math.floor(gap / 4)}`;

  return (
    <motion.div 
      className={`${containerClass} ${gapClass} ${containerClassName}`}
      initial={animationTrigger === 'auto' ? "hidden" : "visible"}
      animate={shouldAnimate ? "visible" : (animationTrigger === 'auto' ? "hidden" : "visible")}
      onClick={animationTrigger === 'click' ? handleTriggerAnimation : undefined}
    >
      {icons.map((iconData, index) => (
        <motion.div
          key={iconData.id}
          className="relative"
          custom={{ 
            delay: shouldAnimate ? index * animationDelay : 0, 
            iconSize
          }}
          variants={dropBounceVariants}
          initial={animationTrigger === 'hover' ? "hidden" : "rest"}
          animate={shouldAnimate ? "visible" : "rest"}
          whileHover={animationTrigger === 'hover' ? {
            ...dropBounceVariants.visible({ delay: 0, iconSize }),
            transition: {
              ...dropBounceVariants.visible({ delay: 0, iconSize }).transition,
              delay: 0
            }
          } : "hover"}
          whileTap={{ scale: 0.95 }}
        >
          <motion.a
            href={iconData.jumpLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              block cursor-pointer transition-all duration-300
              hover:shadow-lg hover:shadow-current/20
              focus:outline-none focus:ring-2 focus:ring-current/50 focus:ring-offset-2
              rounded-lg p-2
              ${animationTrigger === 'click' ? 'select-none' : ''}
              ${className}
            `}
            aria-label={iconData.label || `${iconData.id} social link`}
            variants={hoverVariants}
            title={animationTrigger === 'click' ? '点击容器触发动画' : undefined}
          >
            <Icon 
              icon={iconData.component} 
              size={iconSize}
              className="transition-colors duration-300"
            />
          </motion.a>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedSocialIcons;