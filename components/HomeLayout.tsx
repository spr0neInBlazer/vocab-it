import React, { ReactNode } from 'react';
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children }: { children: ReactNode}) {
  console.log('Home')
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
        <div className="bg-mainBg-light dark:bg-mainBg-dark transition-colors">
          {/* <Navbar /> */}
          <main className="h-screen mx-auto overflow-hidden">{children}</main>
        </div>
      </ThemeProvider>
    </>
  )
}