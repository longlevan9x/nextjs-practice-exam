import React from "react";
import { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import Breadcrumb from "@/components/Breadcrumb";
import Menu from "@/components/Menu";
import ExamRedirect from "@/components/ExamRedirect";
import NotificationContainer from '@/components/common/NotificationContainer';

import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Exam Practice - Luyện thi trực tuyến",
  description: "Hệ thống luyện thi trực tuyến với đa dạng đề thi và bài kiểm tra thực hành",
  keywords: ["luyện thi", "thi trực tuyến", "kiểm tra", "thực hành", "exam", "practice"],
  authors: [{ name: "Exam Practice Team" }],
  openGraph: {
    title: "Exam Practice - Luyện thi trực tuyến",
    description: "Hệ thống luyện thi trực tuyến với đa dạng đề thi và bài kiểm tra thực hành",
    type: "website",
    locale: "vi_VN",
    siteName: "Exam Practice",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white antialiased">
        <NotificationContainer />
        <ExamRedirect />
        {/* Menu */}
        <header className="bg-blue-600 text-white shadow-md px-4">
          <div className="mx-auto px-4 py-4">
            <Menu />
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="bg-gray-100 py-2 shadow-sm px-4">
          <div className="mx-auto px-4">
            <Breadcrumb />
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}
