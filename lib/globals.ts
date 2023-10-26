import { Atma } from "next/font/google";

const INITIAL_NUMBER: number = 3;

const atma = Atma({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});

export {INITIAL_NUMBER, atma};