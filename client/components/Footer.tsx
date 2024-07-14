import Link from 'next/link'
import React from 'react';
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="py-5 mobile:py-7 transition-colors bg-zinc-800 text-gray-300 text-center"
      data-testid="footer"
    >
      <div className="w-11/12 flex-col mobile:flex-row sm:w-4/5 mx-auto flex gap-3 justify-between">
        <div>
          <p className="text-xl text-center mobile:text-left">Vocab It</p>
          <p className="text-center mobile:text-left">Developed by Savvy Itch</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">References</h2>
          <ul>
            <li>Logo by <Link className="underline hover:text-white transition-colors" href="https://icons8.com">Icons8</Link></li>
            <li>Hero images by <Link className="underline hover:text-white transition-colors" href="https://undraw.co/illustrations">unDraw</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <ul className="flex flex-col items-center mobile:items-start">
            <li>
              <Link className="flex items-center gap-1 hover:text-white focus:text-white transition-colors" href="https://github.com/savvy-itch/vocab-it">
                GitHub <HiOutlineExternalLink />
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 hover:text-white focus:text-white transition-colors" href="https://twitter.com/spronetunes">
                Twitter <HiOutlineExternalLink />
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 hover:text-white focus:text-white transition-colors" href="https://www.linkedin.com/in/михайло-савич-a31366248/">
                LinkedIn <HiOutlineExternalLink />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}