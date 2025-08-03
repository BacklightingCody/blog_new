import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PreviewCardProps {
  coverImage: string;
  previewUrl: string;
  href: string;
  coverAlt: string;
  previewTitle: string;
  children: React.ReactNode;
}

export function PreviewCard({
  coverImage,
  previewUrl,
  href,
  coverAlt,
  previewTitle,
  children
}: PreviewCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md">
      <Link href={href} className="block">
        <div className="aspect-video overflow-hidden">
          <Image
            src={coverImage}
            alt={coverAlt}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          {children}
        </div>
      </Link>
    </div>
  );
}