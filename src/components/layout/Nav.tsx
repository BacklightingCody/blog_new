import React from 'react';
import Link from 'next/link';
import navPath from '@/routes/nav-path';

const Nav = () => {
  return (
    <nav className="flex items-center space-x-6">
      {navPath.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="relative px-3 py-2 text-text hover:text-primary transition-colors group"
        >
          <span className="relative z-10">{item.name}</span>
          
          {/* 底部渐变线 */}
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
          
          {/* 悬停时的径向模糊效果 */}
          <span className="absolute inset-0 rounded-md bg-primary opacity-0 group-hover:opacity-10 blur-sm transform scale-110 transition-all"></span>
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
