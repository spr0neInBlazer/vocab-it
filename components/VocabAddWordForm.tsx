import React, { useState } from 'react';
import useVocabStore from '@/lib/store';
import { CheckSingleEditFunction, Word } from '@/lib/types';

import { Label } from '@/components/ui/label';
import { HiPlus } from "react-icons/hi2";
import useProfileStore from '@/lib/profileStore';

export default function VocabAddWordForm({ words, id, checkSingleEdit }: { words: Word[], id: string, checkSingleEdit: CheckSingleEditFunction }) {
  const [newWord, setNewWord] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const addWordToStore = useVocabStore(state => state.addWord);
  const { isAddWord, toggleIsAddWord} = useProfileStore(state => state);

  function enterAddWordMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsAddWord(); // to true
    } else {
      alert('Please finish editing the other field.');
    }
  }

  function addWord(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newWord.length === 0 || !/\S/.test(newWord)) {
      alert('Please enter a valid word');
    } else if (translation.length === 0 || !/\S/.test(translation)) {
      alert('Please enter a valid translation');
    } else if (words.some(w => w.word === newWord)) {
      alert('This word already exists in the vocabulary.')
    } else {
      toggleIsAddWord(); // to false
      if (typeof id === "string") {
        addWordToStore(id, newWord, translation);
      }
    }
    setNewWord('');
    setTranslation('');
  }

  function cancelAddWord() {
    toggleIsAddWord(); // to false
    setNewWord('');
  }

  if (isAddWord) {
    return (
      <form 
        className="flex gap-3 mb-3 mt-6 justify-between items-end" 
        onSubmit={addWord}
      >
        <div className="flex flex-col gap-2 w-3/12">
          <Label>Word</Label>
          <input 
            className="text-lg px-2 border border-slate-600 rounded" 
            value={newWord} 
            onChange={(e) => setNewWord(e.target.value)} 
            size={20}
            placeholder="Enter word"
            autoFocus 
          />
        </div>
        <div className="flex flex-col gap-2 w-3/12">
          <Label>Translation</Label>
          <input 
            className="text-lg px-2 border border-slate-600 rounded" 
            value={translation} 
            onChange={(e) => setTranslation(e.target.value)} 
            placeholder="Enter translation"
            size={20} 
          />
        </div>
        <button 
          className="text-white bg-btnBg hover:bg-hoverBtnBg px-3 py-1 rounded"
          onClick={addWord}
        >
          Create
        </button>
        <button 
          className="bg-secondaryBg-light hover:bg-hoverSecondaryBg text-white px-3 py-1 rounded" 
          onClick={cancelAddWord}
        >
          Cancel
        </button>
      </form>
    )
  }

  return (
    <div>
      <button 
        className="flex gap-1 items-center rounded-lg mt-5 py-1 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors" 
        onClick={enterAddWordMode}
      >
        <HiPlus /> Add Word
      </button>
    </div>
  )
}