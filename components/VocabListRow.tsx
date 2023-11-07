import React, { useEffect, useState } from 'react';
import { Vocab } from '@/lib/types';
import useVocabStore from '@/lib/store';
import useProfileStore from '@/lib/profileStore';
import useSound from 'use-sound';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';

import Link from 'next/link';
import { HiPencilSquare, HiTrash, HiCheckCircle, HiMiniXCircle } from "react-icons/hi2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from './ui/use-toast';
import { errorSound, successSound } from '@/lib/globals';

export default function VocabListRow({ vocab }: { vocab: Vocab }) {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(vocab.title);
  const vocabs = useVocabStore(state => state.vocabs);
  const deleteVocab = useVocabStore(state => state.deleteVocab);
  const editVocabTitle = useVocabStore(state => state.editVocabTitle);
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isEditVocabTitle,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);
  const {toast} = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: 0.25 });
  const [playSuccess] = useSound(successSound, { volume: 0.25 });

  // only allow one field editing at a time
  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  function enterEditTitleMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      setIsEditTitle(true);
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      if (soundOn) playError();
      alert('Enter valid title');
    } 
    // if there's an existing vocab with new title
    else if (vocabs?.some(v => v._id !== vocab._id && v.title === title)) {
      if (soundOn) playError();
      alert('A vocabulary with this title already exists');
    } else {
      editVocabTitle(vocab._id, title);
      setIsEditTitle(false);
      toast({
        variant: 'default',
        description: "Vocabulary title has been successfully updated",
      });
      if (soundOn) playSuccess();
    }
    setTitle(vocab.title);
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setTitle(vocab.title);
      setIsEditTitle(false);
    }
  }

  function deleteVocabFromStore() {
    deleteVocab(vocab._id);
    toast({
      variant: 'default',
      description: "Vocabulary has been deleted",
    });
    if (soundOn) playSuccess();
  }

  useEffect(() => {
    toggleIsEditVocabTitle();
  }, [isEditTitle])

  return (
    <tr className="border-b rounded-md dark:border-mainBg-dark hover:bg-slate-100 dark:hover:bg-customHighlight2 transition-colors">
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
              aria-label="save" 
              onClick={updateTitle}
            >              
              <p className="hidden mobile:inline">Save</p>
              <HiCheckCircle className="inline mobile:hidden text-btnBg hover:text-hoverBtnBg h-8 w-8" /> 
            </button>
          </td>
          <td className="py-3">
            <button 
              className={`rounded-full bg-white mobile:bg-secondaryBg-light mobile:hover:bg-secondaryBg-light/80 mobile:text-white cursor-pointer mobile:px-3 mobile:py-1 mobile:rounded`} 
              aria-label="cancel"
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
          <td className="py-3">
            <button className="text-base" aria-label="edit" onClick={enterEditTitleMode}><HiPencilSquare /></button></td>
          <td className="py-3">
            <AlertDialog>
              <AlertDialogTrigger aria-label="delete">
                <HiTrash />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to delete this vocabulary?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteVocabFromStore}>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </td>
        </>
      )}
    </tr>
  )
}