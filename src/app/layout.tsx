import type { Metadata } from "next";

import "./globals.css";
import { Header } from "./components";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "모바일 게임 시세 확인",
  description: "실시간 모바일 게임 서버별 게임머니 시세를 확인하고 비교하세요",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark-theme">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="dots" />
          <Header />
          {children}
          <div className="bottom-gradient" />
        </AuthProvider>
      </body>
    </html>
  );
}
