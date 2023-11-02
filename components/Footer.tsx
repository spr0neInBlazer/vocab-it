import Link from 'next/link'
import React from 'react';
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Footer() {
  return (
    // absolute bottom-0 left-0 right-0
    <footer className="py-8 transition-colors bg-zinc-800 text-gray-300">
      <div className="w-full sm:w-4/5 mx-auto flex justify-between">
        <div>
          <p className="text-xl">Vocab It</p>
          <p>Developed by Savvy Itch</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">References</h3>
          <ul>
            <li>Logo by <Link className="underline hover:text-white transition-colors" href="https://icons8.com">Icons8</Link></li>
            <li>Hero images by <Link className="underline hover:text-white transition-colors" href="https://undraw.co/illustrations">unDraw</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <ul>
            <li>
              <Link className="flex items-center gap-1 hover:text-white transition-colors" href="https://github.com/savvy-itch/vocab-it">
                GitHub <HiOutlineExternalLink />
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 hover:text-white transition-colors" href="https://twitter.com/spronetunes">
                Twitter <HiOutlineExternalLink />
              </Link>
            </li>
            <li>
              <Link className="flex items-center gap-1 hover:text-white transition-colors" href="https://www.linkedin.com/in/михайло-савич-a31366248/">
                LinkedIn <HiOutlineExternalLink />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}