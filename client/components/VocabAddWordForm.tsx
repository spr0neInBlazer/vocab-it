import React, { useState } from 'react';
import useVocabStore from '@/lib/store';
import { CheckSingleEditFunction, Word } from '@/lib/types';
import { SOUND_VOLUME, errorSound } from '@/lib/globals';
import useSound from 'use-sound';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';

import { Label } from '@/components/ui/label';
import { HiPlus } from "react-icons/hi2";
import FileForm from './FileForm';

export default function VocabAddWordForm({ words, id, checkSingleEdit }: { words: Word[], id: string, checkSingleEdit: CheckSingleEditFunction }) {
  const [newWord, setNewWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const addWordToStore = useVocabStore(state => state.addWord);
  const { isAddWord, toggleIsAddWord } = useProfileStore(state => state);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });

  function enterAddWordMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsAddWord(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field.');
    }
  }

  function addWord(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newWord.length === 0 || !/\S/.test(newWord)) {
      if (soundOn) playError();
      setErrorMsg('Please enter a valid word');
    } else if (translation.length === 0 || !/\S/.test(translation)) {
      if (soundOn) playError();
      setErrorMsg('Please enter a valid translation');
    } else if (words.some(w => w.word === newWord)) {
      if (soundOn) playError();
      setErrorMsg('This word already exists in the vocabulary.')
    } else {
      toggleIsAddWord(); // to false
      if (typeof id === "string") {
        addWordToStore(id, newWord, translation);
      }
      setErrorMsg('');
    }
    setNewWord('');
    setTranslation('');
  }

  function cancelAddWord() {
    toggleIsAddWord(); // to false
    setNewWord('');
    setTranslation('');
    setErrorMsg('');
  }
  
  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      cancelAddWord();
    }
  }

  if (isAddWord) {
    return (
      <>
        <form 
          className="flex w-full sm:max-w-[70%] flex-col sm:flex-row gap-3 mb-3 mt-6 justify-between items-start sm:items-end" 
          onSubmit={addWord}
        >
          <div className="flex flex-col sm:flex-row justify-center gap-2 w-80% sm:w-fit">
            <div className="flex flex-col gap-2">
              <Label>Word</Label>
              <input 
                className="text-base sm:text-lg px-2 leading-9 border border-slate-600 rounded" 
                value={newWord} 
                onChange={(e) => setNewWord(e.target.value)} 
                onKeyDown={checkForAbort}
                size={15}
                maxLength={30}
                placeholder="Enter word"
                autoFocus 
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Translation</Label>
              <input 
                className="text-base sm:text-lg px-2 leading-9 border border-slate-600 rounded" 
                value={translation} 
                onChange={(e) => setTranslation(e.target.value)} 
                onKeyDown={checkForAbort}
                size={15} 
                maxLength={30}
                placeholder="Enter translation"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="text-white bg-btnBg hover:bg-hoverBtnBg focus:bg-hoverBtnBg px-3 py-2 rounded"
              onClick={addWord}
            >
              Create
            </button>
            <button 
              className="bg-secondaryBg-light hover:bg-hoverSecondaryBg focus:bg-hoverSecondaryBg text-white px-3 py-2 rounded" 
              onClick={cancelAddWord}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
      </>
    )
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <button 
        className="flex gap-1 items-center justify-center w-full mobile:w-3/4 rounded-lg mt-5 py-2 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg focus:bg-hoverBtnBg transition-colors" 
        onClick={enterAddWordMode}
      >
        <HiPlus /> Add Word
      </button>
      <p className="font-bold text-lg my-3">OR</p>
      <FileForm id={id} storeWords={words} />
    </div>
  )
}