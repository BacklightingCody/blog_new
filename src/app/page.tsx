'use client'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
export default function Home() {


  return (

    <main className="py-20 w-full h-full grid grid-cols-12 gap-4 justify-center items-center">
      <div className="col-span-7  flex flex-col align-center justify-center">
        <h1 className='text-4xl'>
          Hi, I'm <b>backlighting</b>👋。
        </h1>
        <h1 className='text-4xl py-5'>
          &nbsp;&nbsp;&nbsp;&nbsp;A Front-end &lt;developer / &gt;。
        </h1>
      </div>
      <div className="col-span-5 p-4 flex flex-col align-center justify-center">
        <Avatar className='flex justify-center'>
          <AvatarImage src="/avatar.jpg" className='rounded-full w-[80%]' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1
          className="text-3xl py-5 text-center font-bold text-theme-primary"
        >
          愿你我都能做生活的高手!
        </h1>
      </div>
      <div className='col-span-12 py-5'>
        <h1
          className="mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-theme-primary/150 via-theme-primary/100 to-theme-primary/50 text-2xl">
          Commit 时光拼图
        </h1>
        <img src="https://ghchart.rshah.org/BacklightingCody" alt="GitHub Contributions" className='w-full h-[200px]' />

      </div>
    </main>
  )
}