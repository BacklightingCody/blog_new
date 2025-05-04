import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
// import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-theme-primary/10">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 px-[15%]">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
