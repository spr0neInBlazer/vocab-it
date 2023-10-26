import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes';

import Head from 'next/head'
import Image from 'next/image'
import {HiOutlineArrowDownCircle, HiOutlineArrowUpCircle} from "react-icons/hi2";
import HomeLayout from '@/components/HomeLayout';
import Navbar from '@/components/Navbar';
import { NextPageWithLayout } from './_app';
import { atma } from '@/lib/globals';

// FCP: 1.205s -> .932s
// TTFB: .308s -> .103s

const Home: NextPageWithLayout = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const topSectionRef = useRef<HTMLElement>(null);
  const bottomSectionRef = useRef<HTMLElement>(null);

  function goDown() {
    if (topSectionRef.current && bottomSectionRef.current) {
      topSectionRef.current.style.transform = "translateY(-100vh)";
      bottomSectionRef.current.style.transform = "translateY(-100vh)";
    }
  }

  function goUp() {
    if (topSectionRef.current && bottomSectionRef.current) {
      topSectionRef.current.style.transform = "translateY(0)";
      bottomSectionRef.current.style.transform = "translateY(0)";
    }
  }

  // to apply conditional rendering of the image
  useEffect(() => {
    setIsMounted(true);
  }, [])

  return (
    <>
      <Head>
        <title>Vocab It - self-managed vocabularies</title>
      </Head>
      {/* upper screen */}
      <div>
        <section className="w-full h-screen transition ease-in-out duration-300"
          ref={topSectionRef}
        >
          <Navbar />
          <div className="h-screen sm:w-4/5 mx-auto flex justify-between items-center">
            {isMounted && (
              <Image 
                src={theme === "dark" ? '/images/vocab-hero-dark.svg' : '/images/vocab-hero.svg'}
                width={400}
                height={400}
                alt="lady learning"
              />
            )}
            <div>
              <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">Build vocabularies</p>
              <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">Study at your pace</p>
            </div>
          </div>
          <button className="absolute w-12 h-12 bottom-2 inset-x-2/4 hover:drop-shadow-xl" 
            onClick={goDown}
          >
            <HiOutlineArrowDownCircle className="w-12 h-12 text-customText-light dark:text-customText-dark" />
          </button>
        </section>

        {/* bottom screen */}
        <section className="relative w-full sm:w-4/5 mx-auto pt-20 h-screen transition ease-in-out duration-300 text-customText-light dark:text-customText-dark"
          ref={bottomSectionRef}
        >
          <button className="absolute w-12 h-12 top-2 inset-x-2/4 hover:drop-shadow-xl"
            onClick={goUp}
          >
            <HiOutlineArrowUpCircle className="w-12 h-12 text-customText-light dark:text-customText-dark" />
          </button>
          <div className="w-full flex flex-col gap-5">
            <div className="sm:w-2/4">
              <h2 className="text-4xl font-bold mt-7 mb-4">What is Vocab It?</h2>
              <p className="text-xl break-words">
                <span className={`${atma.className} font-semibold`}>Vocab It</span> empowers your language learning without any restrictions, while keeping it user-friendly.</p>
            </div>
            <div className="flex w-full justify-between items-center">
              <Image
                src="/images/about-hero.svg"
                width={300}
                height={300}
                alt="lady studying"
              />
              <div>
                <h2 className="text-4xl font-bold mt-7 mb-4">How to use it?</h2>
                <ol className="text-xl break-words list-decimal list-inside">
                  <li className="my-2">Create new vocabularies</li>
                  <li className="my-2">Add words you want to learn</li>
                  <li className="my-2">Practice them at your pace</li>
                </ol>
              </div>
            </div>
          </div>
          <button className="animated-btn mx-auto my-7 flex gap-1 items-center rounded-lg py-4 px-8 font-semibold text-white text-xl transition-colors">START NOW</button>
        </section>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (<HomeLayout>{page}</HomeLayout>)
}

export default Home;