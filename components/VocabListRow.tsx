import React, { useState } from 'react';
import { Vocab2 } from '@/lib/types';
import useVocabStore from '@/lib/store';

import Link from 'next/link';
import { HiPencilSquare, HiTrash } from "react-icons/hi2";

export default function VocabListRow({ vocab }: { vocab: Vocab2 }) {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(vocab.title);
  const vocabs = useVocabStore(state => state.vocabs);
  const deleteVocab = useVocabStore(state => state.deleteVocab);
  const editVocabTitle = useVocabStore(state => state.editVocabTitle);

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      alert('Enter valid title');
    } 
    // if there's an existing vocab with new title
    else if (vocabs?.find(v => v.title === title) && title !== vocab.title) {
      alert('A vocabulary with this title already exists');
    } else {
      editVocabTitle(vocab.title, title);
      setIsEditTitle(false);
    }
    setTitle('');
  }

  return (
    <tr key={vocab.title} className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
    {isEditTitle ? (
        <>
          <td className="py-3 pl-2">
            <form onSubmit={updateTitle}>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </form>
          </td>
          <td className="py-3">{vocab.words ? vocab.words.length : 0}</td>
          <td><button className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" onClick={updateTitle}>Save</button></td>
          <td className="py-3">
            <button className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" onClick={() => setIsEditTitle(false)}>Cancel</button>
          </td>
        </>
      ) : (
        <>
          <td className="py-3 pl-2">
            <Link href={`/vocabularies/${encodeURIComponent(vocab.title)}`} className="hover:underline">
              {vocab.title}
            </Link>
          </td>
          <td className="py-3">{vocab.words ? vocab.words.length : 0}</td>
          <td>
            <Link href={`/lesson/${encodeURIComponent(vocab.title)}`} className="text-white rounded py-1 px-3 bg-btnBg hover:bg-hoverBtnBg transition-colors">Start Lesson</Link>
          </td>
          <td className="py-3"><button onClick={() => setIsEditTitle(true)}><HiPencilSquare /></button></td>
          <td className="py-3"><button onClick={() => deleteVocab(vocab.title)}><HiTrash /></button></td>
        </>
      )}
    </tr>
  )
}