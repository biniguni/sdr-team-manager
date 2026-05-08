import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDR Team Manager",
  description: "Team, season, match, lineup, and performance manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
