import React, { useState } from 'react';
import { Vocab2 } from '@/lib/types';
import useVocabStore from '@/lib/store';
import useProfileStore from '@/lib/profileStore';

import Link from 'next/link';
import { HiPencilSquare, HiTrash, HiCheckCircle, HiMiniXCircle } from "react-icons/hi2";

export default function VocabListRow({ vocab }: { vocab: Vocab2 }) {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(vocab.title);
  const vocabs = useVocabStore(state => state.vocabs);
  const deleteVocab = useVocabStore(state => state.deleteVocab);
  const editVocabTitle = useVocabStore(state => state.editVocabTitle);
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
  } = useProfileStore(state => state);

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab) {
      return false;
    }
    return true;
  }

  function enterEditTitleMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      setIsEditTitle(true);
    } else {
      alert('Please finish editing the other field');
    }
  }

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      alert('Enter valid title');
    } 
    // if there's an existing vocab with new title
    else if (vocabs?.some(v => v._id !== vocab._id && v.title === title)) {
      alert('A vocabulary with this title already exists');
    } else {
      editVocabTitle(vocab._id, title);
      setIsEditTitle(false);
    }
    setTitle(vocab.title);
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setTitle(vocab.title);
      setIsEditTitle(false);
    }
  }

  return (
    <tr key={vocab._id} className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
      {isEditTitle ? (
        <>
          <td className="py-3 pl-2">
            <form onSubmit={updateTitle}>
              <input 
                className="leading-8 px-2 rounded" 
                type="text" 
                value={title} 
                size={10}
                maxLength={15}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={checkForAbort} 
                autoFocus 
              />
            </form>
          </td>
          <td className="py-3">{vocab.words ? vocab.words.length : 0}</td>
          <td>
            <button 
              className={`rounded-full bg-white mobile:bg-btnBg mobile:hover:bg-hoverBtnBg mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded`} 
              onClick={updateTitle}
            >              
              <p className="hidden mobile:inline">Save</p>
              <HiCheckCircle className="inline mobile:hidden text-btnBg hover:text-hoverBtnBg h-8 w-8" /> 
            </button>
          </td>
          <td className="py-3">
            <button 
              className={`rounded-full bg-white mobile:bg-secondaryBg-light mobile:hover:bg-secondaryBg-light/80 mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded`} 
              onClick={() => setIsEditTitle(false)}
            >
              <p className="hidden mobile:inline">Cancel</p>
              <HiMiniXCircle className="inline mobile:hidden text-secondaryBg-light hover:text-secondaryBg-light/80 h-8 w-8" />
            </button>
          </td>
        </>
      ) : (
        <>
          <td className="py-3 pl-2">
            <Link 
              href={`/vocabularies/${encodeURIComponent(vocab._id)}`} 
              className="underline hover:text-customText-light/80 dark:hover:text-customText-dark/80"
            >
              {vocab.title}
            </Link>
          </td>
          <td className="py-3">{vocab.words ? vocab.words.length : 0}</td>
          <td>
            <button className={`${vocab.words.length > 0 ? 'text-white' : 'text-gray-300 cursor-default'} text-sm sm:text-base rounded py-1 px-3 bg-btnBg hover:bg-hoverBtnBg transition-colors`}>
              {vocab.words.length > 0 ? (
                <Link 
                  href={`/lesson/${encodeURIComponent(vocab._id)}`} 
                >
                  Start <span className="hidden mobile:inline">Lesson</span>
                </Link>
              ) : (
                <p>Start <span className="hidden mobile:inline">Lesson</span></p>
              )}
            </button>
          </td>
          <td className="py-3"><button onClick={enterEditTitleMode}><HiPencilSquare /></button></td>
          <td className="py-3"><button onClick={() => deleteVocab(vocab._id)}><HiTrash /></button></td>
        </>
      )}
    </tr>
  )
}