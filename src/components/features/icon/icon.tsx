import React from 'react';
import type { ComponentType, SVGProps } from 'react';

type IconProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  size?: number;
  color?: string;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, size = 24, color = 'currentColor', className }) => {
  return <IconComponent width={size} height={size} color={color} className={className} />;
};
