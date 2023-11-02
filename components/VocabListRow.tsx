import React, { useState } from 'react';
import { Vocab2 } from '@/lib/types';
import useVocabStore from '@/lib/store';
import useProfileStore from '@/lib/profileStore';

import Link from 'next/link';
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

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

  return (
    <tr key={vocab._id} className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
      {isEditTitle ? (
        <>
          <td className="py-3 pl-2">
            <form onSubmit={updateTitle}>
              <input 
                className="leading-8 px-2" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                autoFocus 
              />
            </form>
          </td>
          <td className="py-3">{vocab.words ? vocab.words.length : 0}</td>
          <td>
            <button 
              className="bg-btnBg hover:bg-hoverBtnBg text-white cursor-pointer px-3 py-1 rounded" 
              onClick={updateTitle}
            >
              Save
            </button>
          </td>
          <td className="py-3">
            <button 
              className="bg-secondaryBg-light hover:bg-secondaryBg-light/80 text-white cursor-pointer px-3 py-1 rounded" 
              onClick={() => setIsEditTitle(false)}
            >
              Cancel
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
            {vocab.words.length > 0 ? (
              <button className="text-white rounded py-1 px-3 bg-btnBg hover:bg-hoverBtnBg transition-colors">
                <Link 
                  href={`/lesson/${encodeURIComponent(vocab._id)}`} 
                >
                  Start Lesson
                </Link>
              </button>
            ) : (
              <button className="text-gray-300 rounded py-1 px-3 bg-btnBg/80 transition-colors cursor-default">
                Start Lesson
              </button>
            )}
          </td>
          <td className="py-3"><button onClick={enterEditTitleMode}><HiPencilSquare /></button></td>
          <td className="py-3"><button onClick={() => deleteVocab(vocab._id)}><HiTrash /></button></td>
        </>
      )}
    </tr>
  )
}