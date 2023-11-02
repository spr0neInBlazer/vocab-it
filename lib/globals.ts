import { Atma } from 'next/font/google';
import localFont from 'next/font/local';

const INITIAL_NUMBER: number = 3;

// const atma = Atma({
//   weight: ['400', '500', '600'],
//   subsets: ['latin'],
//   display: 'swap',
// });

const arialRounded = localFont({ src: '../public/fonts/arial-rounded-mt.ttf'});
const atma = localFont({src: '../public/fonts/atma-semibold.ttf'});

export {INITIAL_NUMBER, atma, arialRounded};