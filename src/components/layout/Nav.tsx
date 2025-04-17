import Link from 'next/link';
import navPath from '@/routes/nav-path'

const Nav = () => {
  return (
    <nav className="mx-auto overflow-hidden rounded-full border-b border-red-400 bg-red-100">
      <ul className="flex">
        {navPath.map((item) => (
           <li>
           <Link href={item.path} className="block py-2 px-4 pointer text-primary">
             {item.name}
           </Link>
         </li>
        ))}
      </ul>

    </nav>
  );
};
export default Nav;
