import { Atma } from 'next/font/google';
import localFont from 'next/font/local';

const INITIAL_NUMBER: number = 3;
const clickSound = '/audio/click.mp3';
const successSound = '/audio/success.mp3';
const errorSound = '/audio/error.mp3';
const muteSound = '/audio/mute.mp3';
const unmuteSound = '/audio/unmute.mp3';

// const atma = Atma({
//   weight: ['400', '500', '600'],
//   subsets: ['latin'],
//   display: 'swap',
// });

const arialRounded = localFont({ src: '../public/fonts/arial-rounded-mt.ttf'});
const atma = localFont({src: '../public/fonts/atma-semibold.ttf'});

export {
  INITIAL_NUMBER, 
  atma, 
  arialRounded,
  clickSound,
  successSound,
  errorSound,
  muteSound,
  unmuteSound
};