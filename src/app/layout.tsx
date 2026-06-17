import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR Team Manager",
  description: "팀 시즌, 경기, 라인업, 기록 관리 도구",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
