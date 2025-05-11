export default function Docs() {
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
        <img src="/avatar.jpg" className='rounded-full w-[80%]' />
        <h1
          className="text-3xl py-5 text-center font-bold text-theme-primary"
        >
          愿你我都能做生活的高手!
        </h1>
      </div>
    </main>
  )
}