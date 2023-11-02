import React, { useState } from 'react';
import { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import useVocabStore from '@/lib/store';

import VocabList from '@/components/VocabList';
import { HiPlus } from "react-icons/hi2";

export default function ProfileAddVocabSection({checkSingleEdit}: {checkSingleEdit: CheckSingleEditFunction}) {
  const [newVocab, setNewVocab] = useState<string>('');
  const {vocabs, addVocab} = useVocabStore(state => state);
  const {
    isAddVocab, 
    toggleIsAddVocab,
  } = useProfileStore(state => state);

  function enterAddVocabMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsAddVocab(); // to true;
    } else {
      alert('Please finish editing the other field');
    }
  }

  function createVocab(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newVocab.length === 0 || !/\S/.test(newVocab)) {
      alert('Title is required');
    } 
    // if there's an existing vocab with the entered title
    else if (vocabs?.some(v => v.title === newVocab)) {
      alert('A vocabulary with this title already exists');
    } else {
      toggleIsAddVocab(); // to false
      addVocab(newVocab);
    }
    setNewVocab('');
  }

  function cancelAddVocab() {
    toggleIsAddVocab(); // to false
    setNewVocab('');
  }

  return (
    <article>
      <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Vocabularies</h2>
      <VocabList />
      {isAddVocab ? (
        <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={createVocab}>
          <input 
            className="text-lg px-2 rounded border border-zinc-400 dark:border-zinc-300" 
            value={newVocab} 
            onChange={(e) => setNewVocab(e.target.value)} 
            size={15} 
            maxLength={15}
            autoFocus 
          />
          <input 
            className="bg-btnBg hover:bg-hoverBtnBg text-white cursor-pointer px-3 py-1 rounded" 
            type="submit" 
            value="Create" 
          />
          <button 
            className="bg-secondaryBg-light hover:bg-hoverSecondaryBg text-white cursor-pointer px-3 py-1 rounded" 
            onClick={cancelAddVocab}
          >
            Cancel
          </button>
        </form>
        ) : (
        <button 
          className="flex gap-1 items-center rounded-lg py-1 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
          onClick={enterAddVocabMode}
        >
          <HiPlus /> Add Vocabulary
        </button>
      )}
      <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
    </article>
  )
}