'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/backend/lib/supabase";

const Menu: React.FC = () => {
  interface User {
    id: string;
    email: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user as User ?? null);
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
    router.push('/login');
  };

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold ">
        Exam Practice
      </Link>

      <ul className="flex items-center space-x-6">
        <li>
          <Link href="/" className="px-4 py-2 hover:bg-blue-700">
            Đề thi
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link href="/profile" className="px-4 py-2 hover:bg-blue-700">
                Hồ sơ
              </Link>
            </li>
            <li>
              <Link href="/history" className="px-4 py-2 hover:bg-blue-700">
                Lịch sử
              </Link>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 hover:bg-blue-700"
              >
                Đăng xuất
              </button>
            </li>
            <li className="flex items-center">
              <span className="text-sm ">
                {user.email}
              </span>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className="px-4 py-2 hover:bg-blue-700">
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="px-4 py-2 hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Menu;