import React from 'react';
import Link from 'next/link';
import navPath from '@/routes/nav-path';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const Nav = () => {
  const currentPath = usePathname();

  return (
    <nav className={
      clsx('flex items-center space-x-3')
    }>
      {navPath.map((item) => {
        const isActive = currentPath === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className="relative px-3 py-2 group"
          >
            <span className="relative z-10 text-theme-primary">{item.name}</span>

            {/* 底部渐变线（选中或悬停） */}
            <span
              className={clsx(
                'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-theme-primary to-transparent transition-opacity',
                {
                  'opacity-100': isActive,
                  'opacity-0 group-hover:opacity-100': !isActive,
                }
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
