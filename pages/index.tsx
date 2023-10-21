import { useTheme } from 'next-themes';
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import {HiOutlineArrowDownCircle} from "react-icons/hi2";

// FCP: 1.205s -> .932s
// TTFB: .308s -> .103s

export default function Home() {
  const { theme } = useTheme();

  return (
    <>
      <Head>
        <title>Vocab It - self-managed vocabularies</title>
      </Head>
      <div className="w-full flex justify-between items-center">
        <Image 
          src={theme === "dark" ? '/images/vocab-hero-dark.svg' : '/images/vocab-hero.svg'}
          width={400}
          height={400}
          alt="lady learning"
        />
        <div>
          <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">Build vocabularies</p>
          <p className="text-5xl font-bold text-customText-light dark:text-customText-dark">Study at your pace</p>
        </div>
      </div>
      <button className="absolute w-12 h-12 bottom-2 inset-x-2/4 hover:drop-shadow-xl">
        <HiOutlineArrowDownCircle className="w-12 h-12 text-customText-light dark:text-customText-dark" />
      </button>
    </>
  )
}
// Light
/* dress/writing - #6c63ff
hair - #2f2e41
notebook - #3f3d56 */

// Dark 
/* dress - #F50057 

*/