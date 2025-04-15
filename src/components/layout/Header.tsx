import React from 'react';
import Link from 'next/link';
import Nav from './Nav'
const Header = () => {
  return (
    <header className="bg-white-900 text-white py-4 border-b border-gray-100">
      <div className="flex">
        <Nav />
      </div>
    </header>
  );
};

export default Header;
