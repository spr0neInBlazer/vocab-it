import React, { useEffect, useState } from 'react';
import { atma } from '../lib/globals';
import { useTheme } from 'next-themes';
import { Vocab } from '@/lib/types';
import useVocabStore from '@/lib/store';
import dynamic from 'next/dynamic';

import Image from 'next/image';
import { HiGlobeAlt, HiUserCircle, HiFolder, HiSun, HiMoon, HiPlus } from "react-icons/hi2";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from 'next/link';
import NewVocabDialog from './NewVocabDialog';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from './ui/skeleton';

const SoundToggleNoSSR = dynamic(() => import('./SoundToggle'), { 
  loading: () => <Skeleton className="w-11 h-11 ml-1 rounded-full" /> 
});

export default function Navbar() {
  const vocabs = useVocabStore(state => state.vocabs);
  const initialFetch = useVocabStore(state => state.initialFetch);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [vocabTitle, setVocabTitle] = useState<string>("");
  const [invalidInputMsg, setInvalidInputMsg] = useState<string>('');
  const { setTheme } = useTheme();

  function resetDialogInput() {
    setVocabTitle('');
    setInvalidInputMsg('');
  }

  useEffect(() => {
    initialFetch();
  }, [initialFetch]);

  useEffect(() => {
    if (vocabs) {
      setIsFetching(false);
    } else {
      setIsFetching(true);
    }
  }, [vocabs]);

  return (
    <nav className="bg-secondaryBg-light dark:bg-secondaryBg-dark py-2 sm:py-5 absolute top-0 left-0 right-0 transition-colors">
      <div className="w-11/12 mobile:w-4/5 mx-auto flex justify-between items-center">
        <Link href={'/'} className="flex items-center" title="Vocab-It - a language learning app">
          <Image 
            className="-rotate-12"
            src="/images/vocab-logo.png"
            width={64}
            height={64}
            alt='logo'
          />
          <p className={`${atma.className} text-white text-4xl font-bold hidden sm:inline`}>Vocab-It</p>
        </Link>
        <div>
          <Dialog>
            <Menubar className="bg-transparent dark:bg-transparent border-none">
              <MenubarMenu>
                <MenubarTrigger 
                  className="p-1 rounded-md active:bg-transparent focus:bg-transparent dark:active:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white transition-colors"
                  aria-label="vocabularies"
                >
                  <HiGlobeAlt className="w-8 h-8 text-white" />
                </MenubarTrigger>
                <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark" align='end'>
                  {isFetching ? (
                    <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight">
                      <HiFolder className="mr-2" /> LOADING...
                    </MenubarItem>
                  ) : (
                    vocabs?.map((v: Vocab) => {
                      return (
                        <MenubarItem key={v._id} className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight">
                          <Link href={`/vocabularies/${encodeURIComponent(v._id)}`} className="flex items-center w-full">
                            <HiFolder className="mr-2" /> {v.title}
                          </Link>
                        </MenubarItem>)
                    })
                  )}
                  <MenubarSeparator className="dark:bg-customHighlight" />
                  <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight">
                    <DialogTrigger className="flex items-center"
                      onClick={resetDialogInput}
                    >
                      <HiPlus className="mr-2" /> New Vocabulary
                    </DialogTrigger>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger 
                  className="p-1 rounded-md active:bg-transparent focus:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white transition-colors"
                  aria-label="account"
                >
                  <HiUserCircle className="w-8 h-8 fill-white" />
                </MenubarTrigger>

                <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark" align='end'>
                  <MenubarItem className="hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight">
                    <Link className="w-full" href={'/profile/profile'}>Account</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger 
                  className="p-1 rounded-md active:bg-transparent focus:bg-transparent hover:cursor-pointer border-solid border-2 border-transparent hover:border-white transition-colors"
                  aria-label="color theme"
                >
                  <HiSun className="w-8 h-8 fill-white rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <HiMoon className="w-8 h-8 fill-white absolute rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
                </MenubarTrigger>

                <MenubarContent className="dark:border-customHighlight dark:bg-mainBg-dark" align='end'>
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

              <SoundToggleNoSSR />
            </Menubar>

            <NewVocabDialog 
              vocabTitle={vocabTitle} 
              setVocabTitle={setVocabTitle} 
              invalidInputMsg={invalidInputMsg} 
              setInvalidInputMsg={setInvalidInputMsg} 
            />
          </Dialog>
        </div>
      </div>
    </nav>
  )
}