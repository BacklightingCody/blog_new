'use client'
import React, { useState } from 'react';

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  thumbColor?: string;
  trackColor?: string;
  activeTrackColor?: string;
  activeThumbColor?: string;
  ariaLabel?: string;
  className?: string;
}

const sizeMap = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    thumbTranslate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    thumbTranslate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    thumbTranslate: 'translate-x-7',
  },
};

export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  thumbColor = 'white',
  trackColor = 'rgb(229, 231, 235)',
  activeTrackColor = 'rgb(59, 130, 246)',
  activeThumbColor,
  ariaLabel = 'Toggle switch',
  className = '',
}: SwitchProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const { track, thumb, thumbTranslate } = sizeMap[size];

  const trackStyle = {
    backgroundColor: isChecked ? activeTrackColor : trackColor,
  };

  const thumbStyle = {
    backgroundColor: isChecked ? (activeThumbColor || thumbColor) : thumbColor,
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`relative inline-flex ${track} flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      style={trackStyle}
      onClick={handleToggle}
    >
      <span
        className={`pointer-events-none inline-block ${thumb} rounded-full shadow transform transition duration-200 ease-in-out ${
          isChecked ? thumbTranslate : 'translate-x-0'
        }`}
        style={thumbStyle}
      />
    </button>
  );
}

export default Switch; 