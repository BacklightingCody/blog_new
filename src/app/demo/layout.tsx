// src/app/demo/layout.tsx
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
