'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/backend/lib/supabase/client";
import { getCurrentUser } from "@/backend/services/authService";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoIcon from "./icons/Logo";

const Menu: React.FC = () => {
  interface User {
    id: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkUser = async () => {
      const user = await getCurrentUser();
      setUser(user as User ?? null);
    };

    checkUser();

    // Lắng nghe sự kiện thay đổi trạng thái đăng nhập
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user as User ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div>
        <div className="flex justify-between">
          <div className="flex items-center">
            {/* Logo bên trái */}
            <Link href="/" className="flex items-center gap-1 text-xl font-bold">
              <LogoIcon className="h-8 w-8 fill-white" />
              DevCloudly
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/exams" className="cursor-pointer  hover:bg-blue-700 px-3 py-2 text-sm font-medium">
              Đề thi
            </Link>

            {user ? (
              <>
                <Link href="/profile" className="cursor-pointer  hover:bg-blue-700 px-3 py-2 text-sm font-medium">
                  Hồ sơ
                </Link>
                <Link href="/history" className="cursor-pointer  hover:bg-blue-700 px-3 py-2 text-sm font-medium">
                  Lịch sử
                </Link>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer  hover:bg-blue-700 px-3 py-2 text-sm font-medium"
                >
                  Đăng xuất
                </button>
                <span className="text-sm ">
                  {user.email}
                </span>
              </>
            ) : (
              <>
                <Link href="/login" className="cursor-pointer hover:bg-blue-700 px-3 py-2 text-sm font-medium">
                  Đăng nhập
                </Link>
                <Link href="/register" className="cursor-pointer hover:bg-blue-700 px-3 py-2 text-sm font-medium">
                  Đăng ký
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className="block hover:bg-blue-700 px-3 py-2 text-base font-medium">
            Đề thi
          </Link>

          {user ? (
            <>
              <Link href="/profile" className="block hover:bg-blue-700 px-3 py-2 text-base font-medium">
                Hồ sơ
              </Link>
              <Link href="/history" className="block hover:bg-blue-700 px-3 py-2 text-base font-medium">
                Lịch sử
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left hover:bg-blue-700 px-3 py-2 text-base font-medium"
              >
                Đăng xuất
              </button>
              <div className="px-3 py-2 text-sm">
                {user.email}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:bg-blue-700 px-3 py-2 text-base font-medium">
                Đăng nhập
              </Link>
              <Link href="/login" className="block hover:bg-blue-700 px-3 py-2 text-base font-medium">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;