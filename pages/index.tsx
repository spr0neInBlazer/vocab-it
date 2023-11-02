import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes';
import { atma } from '@/lib/globals';
import { NextPageWithLayout } from './_app';

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import {HiOutlineArrowDownCircle, HiOutlineArrowUpCircle} from "react-icons/hi2";
import HomeLayout from '@/components/HomeLayout';
import Navbar from '@/components/Navbar';

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

  const svgStyle = {
    fill: 'secondaryBg-light'
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
        <section className="relative w-full h-screen transition ease-in-out duration-300 z-10"
          ref={topSectionRef}
        >
          <Navbar />
          <div className="h-screen sm:w-4/5 mx-auto flex justify-between items-center">
            {isMounted && (
              <Image 
                src={theme === "dark" ? '/images/vocab-hero-dark.svg' : '/images/vocab-hero.svg'}
                width={500}
                height={500}
                alt="lady learning"
              />
            )}
            <div>
              <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">
                <span className="text-customHighlight3">Build</span> vocabularies
              </p>
              <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">
                <span className="text-customHighlight3">Study</span> at your pace
              </p>
            </div>
          </div>
          <button className="absolute w-12 h-12 bottom-2 inset-x-2/4 flex items-center border-customText-light dark:border-customText-dark hover:border-2 rounded-full" 
            onClick={goDown}
          >
            <HiOutlineArrowDownCircle className="w-12 h-12 text-customText-light dark:text-customText-dark" />
          </button>
          <Image
            className="hidden sm:block absolute opacity-20 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 -z-10"
            src="/images/word-cloud-bg.png"
            width={1500}
            height={700}
            loading="eager"
            alt="bg word cloud"
          />
        </section>

        {/* bottom screen */}
        <section className="relative w-full sm:w-4/5 flex flex-col justify-around mx-auto pt-20 h-screen transition ease-in-out duration-300 text-customText-light dark:text-customText-dark"
          ref={bottomSectionRef}
        >
          <button className="absolute w-12 h-12 top-2 inset-x-2/4 flex items-center border-customText-light dark:border-customText-dark hover:border-2 rounded-full z-50"
            onClick={goUp}
          >
            <HiOutlineArrowUpCircle className="w-12 h-12 text-customText-light dark:text-customText-dark" />
          </button>

          <div className="w-full h-[60%] flex flex-col justify-between">
            <div className="sm:w-2/4">
              <h2 className="text-5xl font-bold text-customHighlight3 mt-7 mb-4">What is Vocab It?</h2>
              <p className="text-2xl font-semibold break-words">
                <span className={`${atma.className} font-bold`}>Vocab It</span> empowers your language learning without any restrictions, while keeping it user-friendly.</p>
            </div>
            <div className="flex w-full justify-between items-center">
              <Image
                src="/images/about-hero.svg"
                width={300}
                height={300}
                alt="lady studying"
              />
              <div>
                <h2 className="text-5xl text-customHighlight3 font-bold mt-7 mb-4">How to use it?</h2>
                <ol className="text-2xl font-semibold break-words list-decimal list-inside">
                  <li className="my-2">Create new vocabularies</li>
                  <li className="my-2">Add words you want to learn</li>
                  <li className="my-2">Practice them at your pace</li>
                  <li>That&#39;s it :)</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href={`/profile/profile`}>
              <button className="animated-btn bg-secondaryBg-light flex gap-1 items-center rounded-lg py-4 px-8 font-semibold text-white text-xl transition hover:animated-btn hover:scale-105">
                START NOW
              </button>
            </Link>
          </div>
          <Image
            className="hidden sm:block absolute opacity-20 inset-x-auto top-[10%] -z-10"
            src="/images/word-cloud-bg.png"
            width={1500}
            height={700}
            alt="bg word cloud"
          />
        </section>
      </div>
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (<HomeLayout>{page}</HomeLayout>)
}

export default Home;