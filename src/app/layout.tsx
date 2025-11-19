import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadCurrentUser } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "員工分流系統",
  description:
    "由老闆掌控的多分店人力調度平台，整合 Supabase Auth 與 Vercel 部署。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await loadCurrentUser();
  const userName =
    user?.user_metadata?.username ??
    user?.user_metadata?.full_name ??
    user?.email ??
    null;

  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteNav isAuthenticated={!!user} userName={userName} />
        <main>{children}</main>
      </body>
    </html>
  );
}
