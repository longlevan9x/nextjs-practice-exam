import React from "react";
import { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import Breadcrumb from "@/components/Breadcrumb";
import Menu from "@/components/Menu";
import ExamRedirect from "@/components/ExamRedirect";
import NotificationContainer from '@/components/common/NotificationContainer';
import ScrollToTop from "@/components/common/ScrollToTop";
import "./globals.css";
import "./globals.scss";
import { ThemeProvider } from "next-themes";
import WindowMessageListener from "@/components/common/WindowMessageListener";
import CheckExtensionInstalled from "@/components/common/CheckExtensionInstalled";
import { ModalProvider } from "@/components/contexts/ModalContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
  
export const metadata: Metadata = {
  title: "DevCloudly - Luyện thi chứng chỉ Cloud chuyên sâu",
  description: "Nền tảng luyện thi chứng chỉ Cloud (AWS, GCP, Azure) với các bài thực hành chất lượng cao và trải nghiệm sát đề thi thực tế",
  keywords: ['DevCloudly', 'luyện thi cloud', 'chứng chỉ AWS', 'GCP', 'Azure', 'cloud computing', 'thực hành', 'thi thử'],
  authors: [{ name: "DevCloudly Team" }],
  openGraph: {
    title: "DevCloudly - Luyện thi trực tuyến",
  description: "Nền tảng luyện thi chứng chỉ Cloud (AWS, GCP, Azure) với các bài thực hành chất lượng cao và trải nghiệm sát đề thi thực tế",
    type: "website",
    locale: "vi_VN",
    siteName: "DevCloudly",
    url: 'https://devcloudly.vercel.app',
    images: [
      {
        url: 'https://devcloudly.vercel.app/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'DevCloudly - Luyện thi trực tuyến',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo/logo_ico.png" />
      </head>
      <body className="bg-white dark:bg-neutral-900 antialiased h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ModalProvider>
            <WindowMessageListener />
            <CheckExtensionInstalled />
            <NotificationContainer />
            <ExamRedirect />
            {/* Menu */}
            <header className="bg-blue-600 text-white shadow-md px-2 lg:px-4 dark:bg-blue-900">
              <div className="mx-auto lg:px-4 py-1">
                <Menu />
              </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-gray-100 dark:bg-neutral-800 py-2 shadow-sm">
              <div className="mx-auto px-2 lg:px-4">
                <Breadcrumb />
              </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-300">
              {children}
            </main>
            <ScrollToTop />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
