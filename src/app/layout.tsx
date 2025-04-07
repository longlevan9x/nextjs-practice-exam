'use client';
import React from "react";
// import { Geist, Geist_Mono } from "next/font/google";
import Breadcrumb from "@/components/Breadcrumb";
import Menu from "@/components/Menu";

import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white antialiased">
        {/* Menu */}
        <header className="bg-blue-600 text-white shadow-md px-4">
          <div className="mx-auto px-4 py-4">
            <Menu />
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-gray-100 py-2 shadow-sm px-4">
          <div className=" mx-auto px-4">
            <Breadcrumb />
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
