import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from '@/components/layout/Layout'
import { Providers } from "./providers";
import ClientClerkProvider from '@/components/theme/ClientClerkProvider';
import UserSync from "@/components/user/UserSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "backlighting",
  description: "一个现代化的博客平台",
  keywords: ["博客", "技术", "编程", "生活"],
  authors: [{ name: "backlighting" }],
  openGraph: {
    title: "backlighting",
    description: "一个现代化的博客平台",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientClerkProvider>
          <UserSync />
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </ClientClerkProvider>
      </body>
    </html>

  );
}
