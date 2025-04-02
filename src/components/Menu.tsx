import React from "react";
import Link from "next/link";

const Menu: React.FC = () => {
  return (
    <nav className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Website</h1>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/exams" className="hover:underline">
            Exams
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;