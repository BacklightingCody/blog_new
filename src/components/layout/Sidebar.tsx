// src/components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white w-64 p-6">
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/demo/page1">
              Page 1
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/demo/page2">
              Page 2
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/demo/page3">
              Page 3
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
