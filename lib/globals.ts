import localFont from 'next/font/local';

const INITIAL_NUMBER: number = 3;
const clickSound = '/audio/click.mp3';
const successSound = '/audio/success.mp3';
const errorSound = '/audio/error.mp3';
const muteSound = '/audio/mute.mp3';
const unmuteSound = '/audio/unmute.mp3';

const arialRounded = localFont({ src: '../public/fonts/arial-rounded-mt.woff2', adjustFontFallback: 'Arial'});
const atma = localFont({src: '../public/fonts/atma-semibold.woff2', adjustFontFallback: 'Arial'});

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