import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import Head from 'next/head';
import { arialRounded } from '@/lib/globals';

export default function Layout({ children }: { children: ReactNode}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn new words and build you own vocabularies"
        />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="bg-mainBg-light dark:bg-mainBg-dark text-customText-light dark:text-customText transition-colors">
          <main className={`${arialRounded.className} h-[100dvh] mx-auto overflow-hidden`}>{children}</main>
        </div>
      </ThemeProvider>
    </>
  )
}