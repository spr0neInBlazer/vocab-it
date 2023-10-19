import React, { useState } from 'react';
import { Word } from '@/lib/types';

import { HiPencilSquare, HiTrash } from "react-icons/hi2";
import useVocabStore from '@/lib/store';

export default function SingleWord({ word, index, vocabTitle, length }: { word: Word, index: number, vocabTitle: string, length: number }) {
  const [isEditWord, setIsEditWord] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>(word.word);
  const [newTranslation, setNewTranslation] = useState<string>(word.translation);
  const deleteWord = useVocabStore(state => state.deleteWord);
  const editWord = useVocabStore(state => state.editWord);

  function submitEdit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (newWord.length === 0 || !/\S/.test(newWord) 
      || newTranslation.length === 0 || !/\S/.test(newTranslation)) {
        alert('Enter valid word');
    } else {
      editWord(vocabTitle, index, newWord, newTranslation);
      setIsEditWord(false);
    }
    setNewWord('');
    setNewTranslation('');
  }

  return (
    <article>
      {isEditWord ? (
        <form className="flex justify-between my-1 p-2 rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors"
          onSubmit={submitEdit}>
          <input className="w-1/2 rounded" value={newWord} onChange={(e) => setNewWord(e.target.value)} size={20} autoFocus />
          <input className="w-1/4 rounded" value={newTranslation} onChange={(e) => setNewTranslation(e.target.value)} size={20} />
          <input className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Update" 
            onClick={() => setIsEditWord(true)} />
        </form>
      ) : (
        <div className="flex justify-between my-1 p-2 rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
          <p className="w-1/2">{word.word}</p>
          <p className="w-1/4">{word.translation}</p>
          <div className="flex gap-1">
            <button onClick={() => setIsEditWord(true)}><HiPencilSquare /></button>
            <button onClick={() => deleteWord(vocabTitle as string, word.word)}><HiTrash /></button>
          </div>
        </div>
      )}
      {index !== length - 1 ? <div className="h-px w-full dark:bg-mainBg-dark" /> : ''}
    </article>
  )
}