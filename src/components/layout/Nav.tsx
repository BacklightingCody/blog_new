import Link from 'next/link';
import styles from './css/Nav.module.css';
const Nav = () => {
  return (
    <nav className="mx-auto overflow-hidden rounded-full border-b border-red-400 bg-red-100">
      <ul className="flex gap-2">
        <li>
          <Link href="/" className="block py-2 px-4 bg-blue-100">
            Index
          </Link>
        </li>
        <li>
          <Link href="/demo" className="block py-2 px-4 bg-blue-100">
            Demo
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Nav;
