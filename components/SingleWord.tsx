import React, { useEffect, useState } from 'react';
import { CheckSingleEditFunction, Vocab2, Word } from '@/lib/types';
import useVocabStore from '@/lib/store';
import useSound from 'use-sound';
import { errorSound } from '@/lib/globals';
import useProfileStore from '@/lib/profileStore';

import { HiPencilSquare, HiTrash, HiCheckCircle, HiMiniXCircle } from "react-icons/hi2";
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';

type SingleWordProps = {
  word: Word,
  vocab: Vocab2,
  checkSingleEdit: CheckSingleEditFunction
}

export default function SingleWord({ word, vocab, checkSingleEdit }: SingleWordProps) {
  const [isEditSingleWord, setIsEditSingleWord] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>(word.word);
  const [newTranslation, setNewTranslation] = useState<string>(word.translation);
  const deleteWord = useVocabStore(state => state.deleteWord);
  const editWord = useVocabStore(state => state.editWord);
  const { toggleIsEditWord } = useProfileStore(state => state);
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: 0.25 });

  function enterEditWordMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      setIsEditSingleWord(true);
      toggleIsEditWord(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function exitEditWordMove() {
    setIsEditSingleWord(false);
    toggleIsEditWord(); // to false
  }

  function submitEdit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (newWord.length === 0 || !/\S/.test(newWord) 
      || newTranslation.length === 0 || !/\S/.test(newTranslation)) {
        if (soundOn) playError();
        alert('Enter valid word');
    } else if (vocab.words.some(w => w.word === newWord)) {
      if (soundOn) playError();
      alert('This word already exists in the vocabulary.')
    } else {
      editWord(vocab._id, word.word, newWord, newTranslation);
      setIsEditSingleWord(false);
      toggleIsEditWord(); // to false
    }
    setNewWord(word.word);
    setNewTranslation(word.translation);
  }

  return (
    <article className="text-sm mobile:text-base">
      {isEditSingleWord ? (
        <form 
          className="flex justify-between my-1 p-2 rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors"
          onSubmit={submitEdit}
        >
          <input 
            className="w-1/3 pl-2 border border-slate-600 rounded" 
            value={newWord} 
            onChange={(e) => setNewWord(e.target.value)} 
            size={20} 
            autoFocus 
          />
          <input 
            className="w-1/3 pl-2 border border-slate-600 rounded" 
            value={newTranslation} 
            onChange={(e) => setNewTranslation(e.target.value)} 
            size={20} 
          />
          <button 
            className="rounded-full bg-white"
            onClick={enterEditWordMode}
          >
            <HiCheckCircle className="text-btnBg hover:text-hoverBtnBg h-8 w-8" />
          </button>
          <button 
            className="rounded-full bg-white" 
            onClick={exitEditWordMove}
          >
            <HiMiniXCircle className="text-secondaryBg-light hover:text-secondaryBg-light/80 h-8 w-8" />
          </button>
        </form>
      ) : (
        <div className="flex justify-between my-1 p-2 rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
          <p className="w-1/2">{word.word}</p>
          <p className="w-1/4">{word.translation}</p>
          <div className="flex gap-1">
            <button className="text-base" onClick={enterEditWordMode}><HiPencilSquare /></button>
            <button className="text-base" onClick={() => deleteWord(vocab._id as string, word.word)}><HiTrash /></button>
          </div>
        </div>
      )}
      {/* separator */}
      {vocab.words[vocab.words.length - 1].word !== word.word && <div className="h-px w-full dark:bg-mainBg-dark" />}
    </article>
  )
}