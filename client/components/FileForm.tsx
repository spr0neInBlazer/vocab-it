import React, { useRef, useState } from 'react';
import { Word } from '@/lib/types';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import useVocabStore from '@/lib/store';
import { useToast } from './ui/use-toast';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';
import useSound from 'use-sound';
import { Label } from './ui/label';
import { HiDocumentText } from "react-icons/hi2";

function decodeString(str: string): string {
  let encoding = jschardet.detect(str).encoding;
  // add fallback encoding if current is not supported
  if (encoding === 'x-mac-cyrillic') {
    encoding = 'utf8';
  }
  const decodedStr = iconv.decode(Buffer.from(str, 'binary'), encoding);
  return decodedStr;
}

export default function FileForm({ id, storeWords }: { id: string, storeWords: Word[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [importedWords, setImportedWords] = useState<Word[]>([]);
  const { importWords } = useVocabStore(state => state);
  const { toast } = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [filePreview, setFilePreview] = useState<string>('No file selected');
  const [isSelectFile, setIsSelectFile] = useState<boolean>(false);

  function displayFileInfo(e: React.SyntheticEvent) {
    e.preventDefault();
    
    if (inputRef.current) {
      const files = inputRef.current.files;
      if (files && files.length > 0) {
        const file = files[0];
        // if the file type isn't .txt or .csv
        if (file.type !== 'text/plain' && file.type !== 'text/csv') {
          if (soundOn) playError();
          alert('Please choose .txt/.csv file');
          return;
        }
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target) {
            const words: Word[] = [];
            const fileContent = event.target.result as string;

            if (fileContent.length === 0) return;

            let startIdx = 0;

            for (let i = 1; i < fileContent.length; i++) {
              // if it's a separator
              if (fileContent[i] === ';' || fileContent[i] === ',') {
                // if a word was provided without translation
                if (fileContent[i+1] === "\r" && fileContent[i+2] === "\n") {
                  // move to the next line
                  startIdx = i+3;
                  i += 2;
                } else {
                  // if it's a valid word
                  let wordStr = fileContent.substring(startIdx, i);
                  const decodedWord: string = decodeString(wordStr);
                  const wordObj: Word = {word: decodedWord, translation: ''};
                  words.push(wordObj);
                  // if file uses incorrect indentation (', ')
                  (fileContent[i+1] === ' ') ? startIdx = i+2 : startIdx = i+1;
                }
              } else if (fileContent[i] === "\n") {
                // if it's the end of the line
                let translationStr = fileContent.substring(startIdx, i-1);
                // if no valid translation, remove last word object
                const decodedTranslation: string = decodeString(translationStr);
                words[words.length - 1].translation = decodedTranslation;
                startIdx = i+1;
              } else if (i === fileContent.length - 1) {
                let translationStr = fileContent.substring(startIdx, i+1);
                const decodedTranslation: string = decodeString(translationStr);
                words[words.length - 1].translation = decodedTranslation;
              }
            }
            checkForDuplicateWords(words);
          }
        }
        reader.readAsBinaryString(file);
      }
    }
  }

  function checkForDuplicateWords(words: Word[]) {
    const wordSet = new Set();
    const uniqueWords: Word[] = [];
    for (const word of words) {
      // if there's no duplicates in the file and in the store
      if (!wordSet.has(word.word) && !storeWords.some(w => w.word === word.word)) {
        wordSet.add(word.word);
        uniqueWords.push(word);
      }
    }
    setImportedWords(uniqueWords);
    if (uniqueWords.length > 0) {
      importWords(id, uniqueWords);
      toast({
        variant: 'default',
        description: "Data has been successfully imported",
      });
      if (soundOn) playSuccess();
    } 
  }

  function displayFileName() {
    if (inputRef.current) {
      const files = inputRef.current.files;
      if (files && files.length > 0) {
        setFilePreview(files[0].name);
        setIsSelectFile(true);
      }
    }
  }

  return (
    <form 
      className="w-full mobile:w-3/4 xl:w-1/2 flex flex-col justify-center items-center font-sans px-1 py-2 rounded-md border-2 border-zinc-400 dark:border-zinc-300"
      onSubmit={displayFileInfo}
    >
      <p className="text-lg mt-1">Import a <span className="font-mono font-semibold">.txt/.csv</span> file</p>
      <p className="mb-3">(in the form &#34;word,translation&#34;)</p>
      <Label
        className="w-full mobile:w-2/3 text-center text-base text-white p-2 rounded bg-zinc-700 hover:bg-zinc-800 hover:cursor-pointer transition-colors" 
        htmlFor="words-file"
      >
        Choose file
      </Label>
      <input 
        className="opacity-0 h-0"
        ref={inputRef}
        id="words-file" 
        name="words file" 
        type="file"
        accept=".txt, .csv"
        onChange={displayFileName}
      />
      <p className="my-3 italic flex justify-center items-center gap-1 w-80 max-w-[90%] overflow-hidden">{isSelectFile && <HiDocumentText />} {filePreview}</p>
      <button 
        className="w-full mobile:w-auto text-center text-base text-white font-semibold py-2 px-5 rounded bg-zinc-700 hover:bg-zinc-800 hover:cursor-pointer disabled:cursor-default disabled:bg-zinc-600 disabled:text-zinc-300 transition-colors"
        type="submit" 
        onSubmit={displayFileInfo}
        disabled={!isSelectFile}
      >
        Submit
      </button>
    </form>
  )
}