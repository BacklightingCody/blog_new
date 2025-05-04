import GithubStar from '../features/GithubStar'
export default function Footer() {
  return (
    <footer className='px-[15%] flex flex-col items-center justify-center w-full h-[50px] bg-theme-primary/5 inset-shadow-sm inset-shadow-theme-primary/5'>
      <div className='flex justify-end w-full'>
        <GithubStar />
      </div>
    </footer>
  )
}