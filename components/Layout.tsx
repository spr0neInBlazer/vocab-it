import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="bg-mainBg-light dark:bg-mainBg-dark transition-colors">
        <Navbar />
        <main className="min-h-screen w-4/5 mx-auto flex items-center">{children}</main>
      </div>
    </ThemeProvider>
  )
}
