import localFont from 'next/font/local';

// const BASE_URL="http://localhost:3500";
const BASE_URL="https://api-vocab-it.koyeb.app";
const INITIAL_NUMBER: number = 3;
const MAX_WORDS = 100;
const SOUND_VOLUME = 0.25;
const clickSound = '/audio/click.mp3';
const successSound = '/audio/success.mp3';
const errorSound = '/audio/error.mp3';
const muteSound = '/audio/mute.mp3';
const unmuteSound = '/audio/unmute.mp3';

const arialRounded = localFont({ src: '../public/fonts/arial-rounded-mt.woff2', adjustFontFallback: 'Arial'});
const atma = localFont({src: '../public/fonts/atma-semibold.woff2', adjustFontFallback: 'Arial'});

const specialSymbols = {
  FRA: ['à', 'é', 'è', 'ç', 'î', 'ô', 'ù', 'ë', 'ï', 'œ', 'æ'],
  GER: ['ä', 'ö', 'ü', 'ß', 'é'],
  SPA: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡']
}

export {
  BASE_URL,
  INITIAL_NUMBER, 
  MAX_WORDS,
  SOUND_VOLUME,
  atma, 
  arialRounded,
  clickSound,
  successSound,
  errorSound,
  muteSound,
  unmuteSound,
  specialSymbols
};