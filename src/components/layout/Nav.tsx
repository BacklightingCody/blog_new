import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import navPath from '@/routes/nav-path';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/common/dropdown-menu';

const Nav = () => {
  const currentPath = usePathname();
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});

  // 初始化显示名称
  useEffect(() => {
    const initialNames = navPath.reduce((acc, item) => {
      acc[item.path] = item.name;
      return acc;
    }, {} as Record<string, string>);
    setDisplayNames(initialNames);
  }, []);

  // 处理子项点击
  const handleChildClick = (parentPath: string, childName: string) => {
    setDisplayNames(prev => ({
      ...prev,
      [parentPath]: childName
    }));
  };

  // 处理路由变化
  useEffect(() => {
    const currentParent = navPath.find(item =>
      item.children?.some(child => child.path === currentPath)
    );

    if (currentParent) {
      const child = currentParent.children?.find(child => child.path === currentPath);
      if (child) {
        setDisplayNames(prev => ({
          ...prev,
          [currentParent.path]: child.name
        }));
      }
    } else {
      // 如果当前路径不是任何子项，恢复父级名称
      navPath.forEach(item => {
        if (item.children) {
          setDisplayNames(prev => ({
            ...prev,
            [item.path]: item.name
          }));
        }
      });
    }
  }, [currentPath]);

  return (
    <nav className={
      clsx('flex items-center space-x-3')
    }>
      {navPath.map((item) => {
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + "/");
        return item.children ? (
          <DropdownMenu key={item.path}>
            <DropdownMenuTrigger asChild>
              <Link
                key={item.path}
                href={item.path}
                className="relative px-3 py-2 group text-theme-primary"
              >
                {displayNames[item.path] || item.name}
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
            className="relative px-3 py-2 group text-theme-primary"
          >
            <span className="relative z-10">{item.name}</span>
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
