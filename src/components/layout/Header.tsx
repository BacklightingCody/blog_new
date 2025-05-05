'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import clsx from 'clsx';
import { useScrollPosition, useMousePosition } from '@/hooks';
import { ModeToggle } from '@/components/theme/ModeToggle'
import { ThemeSelector } from '../theme/ThemeSelector';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import styles from './css/Layout.module.css'
import svg from '/Backlighting.svg'
import Signature from '@/components/common/signature'
// import ThemeController from '../theme/ThemeController';


const Header = () => {
  const { y } = useScrollPosition(); // 获取滚动位置的 y 值
  const threshold = 64; // 你希望的阈值，header 的高度

  const [ref, mousePos] = useMousePosition();
  return (
    <header className={clsx('sticky top-0 py-4 flex justify-around items-center w-full z-10 p-[16%]  h-16  transform translate-z-0 backdrop-saturate-180 backdrop-blur', y > threshold && styles.shadow)}>
      <div className={clsx('fixed left-0 ')}>
        <Signature width={180} className=''></Signature>
      </div>
      <div className="container mx-auto flex justify-between items-center">
        <div className='w-[100px] h-full bg-theme-primary'>
          <Avatar className='size-12'>
            <AvatarImage src="/avatar.jpg" alt="backlighting's photo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div
          ref={ref}
          className={clsx(
            "relative overflow-hidden rounded-full px-3",
            {
              "border-b-1 border-theme-primary/20 inset-shadow-sm inset-shadow-theme-primary/10": y < threshold,
            }
          )}
        >
          {mousePos.x !== null && mousePos.y !== null && (
            <span
              className="absolute rounded-md bg-theme-primary opacity-10 blur-sm"
              style={{
                left: mousePos.x - 75,
                top: mousePos.y - 50,
                width: "150px",
                height: "100px",
                background: "radial-gradient(circle, var(--theme-primary) 0%, transparent 100%)",
                opacity: 0.15,
              }}
            />
          )}
          <Nav />
        </div>
        <div className='flex items-center space-x-4'>
          <Avatar className='size-10'>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ModeToggle />
          <ThemeSelector />
        </div>
      </div>
    </header >
  );
};

export default Header;
