'use client'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // 假设你的 Avatar 组件路径

export default function OAuth() {
  return (
    <>
      <SignedOut>
        {/*
          将 Avatar 包裹在 SignInButton 中。
          当 Avatar 被点击时，SignInButton 会捕获点击事件并打开登录弹窗。
          你可以通过 `mode="modal"` 确保它以模态框形式弹出。
        */}
        <SignInButton mode="modal">
          <Avatar className='size-10 cursor-pointer'>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </SignInButton>

      </SignedOut>
      <SignedIn>
        {/* 用户已登录时显示 UserButton */}
        <UserButton />
      </SignedIn>
    </>
  );
}