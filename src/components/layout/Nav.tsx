import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import navPath from '@/routes/nav-path';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/common/dropdown-menu';
import { useSliderUnderline } from '@/hooks';

const Nav = () => {
  const currentPath = usePathname();
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  const navRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;

  // 下划线效果

  const parentPath = useMemo(() => {
    const match = navPath.find(item => currentPath === item.path || currentPath.startsWith(item.path + '/'));
    return match?.path || currentPath;
  }, [currentPath]);

  const { sliderStyle, getItemRef } = useSliderUnderline<HTMLAnchorElement>({
    activeKey: parentPath,
    color: 'var(--theme-primary)',
    animationDuration: 300,
    animationDelay: 0,
    containerRef: navRef,
    height: 2,
    insetX: 4,
    bottomOffset: -1,
  });

  // 初始化或路由变更时更新 displayNames
  useEffect(() => {
    const initialNames = navPath.reduce((acc, item) => {
      acc[item.path] = item.name;
      return acc;
    }, {} as Record<string, string>);

    const currentParent = navPath.find(item =>
      item.children?.some(child => child.path === currentPath)
    );

    if (currentParent) {
      const currentChild = currentParent.children?.find(child => child.path === currentPath);
      if (currentChild) {
        initialNames[currentParent.path] = currentChild.name;
      }
    }

    setDisplayNames(initialNames);
  }, [currentPath]);

  // 处理子项点击
  const handleChildClick = (parentPath: string, childName: string) => {
    setDisplayNames(prev => ({
      ...prev,
      [parentPath]: childName
    }));
  };

  return (
    <nav ref={navRef} className={clsx('flex items-center relative px-3')}>
      {navPath.map((item) => {
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
        return item.children ? (
          <DropdownMenu key={item.path}>
            <DropdownMenuTrigger asChild>
              <Link
                key={item.path}
                href={item.path}
                className="relative px-4 py-2 group text-theme-primary"
                ref={getItemRef(item.path)}
              >
                {displayNames[item.path] || item.name}
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" triggerRect={null} className='top-[10px]'>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  key={item.path}
                  asChild
                  onClick={() => handleChildClick(item.path, item.name)}
                  className='inline-block text-center text-theme-primary font-bold hover:bg-theme-accent/50'
                >
                  <Link href={item.path} className='hover:text-theme-primary font-bold'>
                    {item.name}
                  </Link>
                </DropdownMenuItem>
                {item.children.map((child) => (
                  <DropdownMenuItem
                    key={child.path}
                    asChild
                    onClick={() => handleChildClick(item.path, child.name)}
                    className='inline-block text-center text-theme-primary font-bold hover:bg-theme-accent/50'
                  >
                    <Link href={child.path} className='hover:text-theme-primary font-bold'>{child.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.path}
            href={item.path}
            className="relative px-4 py-2 group text-theme-primary"
            ref={getItemRef(item.path)}
          >
            <span className="relative z-10">{item.name}</span>
          </Link>
        );
      })}
      <div
        className="absolute pointer-events-none transition-all duration-300"
        style={{
          ...sliderStyle,
          position: 'absolute',
          pointerEvents: 'none',
        }}
      />
    </nav>
  );
};

export default Nav;
