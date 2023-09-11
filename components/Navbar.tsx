import Image from 'next/image';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import React from 'react';
import { HiGlobeAlt, HiUserCircle, HiFolder, HiSun, HiMoon, HiPlus } from "react-icons/hi2";
import { useTheme } from 'next-themes';
import { Atma } from 'next/font/google';
import Link from 'next/link';

const atma = Atma({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Navbar() {
  const { setTheme } = useTheme();

  return (
    <nav className="bg-secondaryBg-light dark:bg-secondaryBg-dark py-5 absolute top-0 left-0 right-0 transition-colors">
      <div className="w-4/5 mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src="/images/vocab-logo.png"
            width={64}
            height={64}
            alt='logo'
          />
          <Link href={'/'} className={`${atma.className} text-white text-4xl font-bold`}>Vocab It</Link>
        </div>
        <div>
          <Menubar className="bg-transparent dark:bg-transparent border-none">
            <MenubarMenu>
              <MenubarTrigger 
                className="p-1 rounded-md active:bg-transparent focus:bg-transparent dark:active:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white">
                <HiGlobeAlt className="w-8 h-8 text-white" />
              </MenubarTrigger>

              <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark">
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"><HiFolder className="mr-2" /> English</MenubarItem>
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"><HiFolder className="mr-2" /> French</MenubarItem>
                <MenubarSeparator className="dark:bg-customHighlight" />
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"><HiPlus className="mr-2" /> New Vocabulary</MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger 
                className="p-1 rounded-md active:bg-transparent focus:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white">
                <HiUserCircle className="w-8 h-8 fill-white" />
              </MenubarTrigger>

              <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark">
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight">
                  <Link href={'/profile/profile'}>Account</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger 
                className="p-1 rounded-md active:bg-transparent focus:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white">
                <HiSun className="w-8 h-8 fill-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <HiMoon className="w-8 h-8 fill-white absolute rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
                {/* absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 */}
              </MenubarTrigger>

              <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark">
                <MenubarItem 
                  className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"
                  onClick={() => setTheme("light")}
                >
                  Light
                </MenubarItem>
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </MenubarItem>
                <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight"
                  onClick={() => setTheme("system")}
                >
                  System
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </nav>
  )
}