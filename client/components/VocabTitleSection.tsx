import React, { useState } from 'react'
import { CheckSingleEditFunction } from '@/lib/types';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useSound from 'use-sound';
import { BASE_URL, SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';
import useVocabStore from '@/lib/store';
import { useToast } from './ui/use-toast';
import useProfileStore from '@/lib/profileStore';

import { Button } from '@/components/ui/button';
import { HiPencilSquare } from "react-icons/hi2";
import useAuth from '@/hooks/useAuth';
import useRefreshToken from '@/hooks/useRefreshToken';

export default function VocabTitleSection({ id, vocabTitle, checkSingleEdit }: { id: string, vocabTitle: string, checkSingleEdit: CheckSingleEditFunction }) {
  const [title, setTitle] = useState<string>(vocabTitle);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const {
    vocabs,
    editVocabTitle
  } = useVocabStore(state => state);
  const {isEditVocabTitle, toggleIsEditVocabTitle} = useProfileStore(state => state);
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const { toast } = useToast();
  const fetchWithAuth = useAuth();
  const refresh = useRefreshToken();

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();
    
    if (title === null) return;
    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      if (soundOn) playError();
      setErrorMsg('Enter a valid title');
    } else if (vocabs?.some(v => v.title === title && v._id !== id)) {
      if (soundOn) playError();
      setErrorMsg('A vocabulary with this title already exists');
    } else {
      const controller = new AbortController();
      const privateUpdate = async () => {
        try {
          const res = await fetchWithAuth(`${BASE_URL}/vocabs/updateTitle`, {
            method: 'PATCH',
            signal: controller.signal,
            body: JSON.stringify({ _id: id, title }),
            credentials: 'include'
          });

          if (!res.ok) {
            toast({
              variant: 'destructive',
              description: "Username could not be updated",
              duration: 1500
            });
            if (soundOn) playError();
            throw new Error('Failed to update title');
          }

          await refresh();
          editVocabTitle(id, title);
          toggleIsEditVocabTitle(); // to false
          toast({
            variant: 'default',
            description: "Vocabulary title has been updated",
            duration: 1500
          });
          if (soundOn) playSuccess();
        } catch (error) {
          console.error(error);
        }
      }

      privateUpdate();

      return () => {
        controller.abort();
      }
    }
  }

  function enterEditTitleMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditVocabTitle(); // to true
    } else {
      if (soundOn) playError();
      alert('Please finish editing the other field.');
    }
  }

  if (isEditVocabTitle) {
    return (
    <div className="col-span-2 justify-self-center sm:justify-self-start">
      <form 
        className="flex justify-center gap-2 items-center" 
        onSubmit={updateTitle}
      >
        <div className="flex justify-between items-center gap-2">
          <input 
            className="text-2xl pl-2 leading-10 border border-slate-600 rounded" type="text" 
            size={10}
            maxLength={15}
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            autoFocus 
          />
          <Button 
            className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-white dark:text-white"
            onSubmit={updateTitle}
          >
            Save
          </Button>
        </div>
      </form>
      <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
    </div>
  )}

  return (
    <div className="justify-self-center flex gap-2">
      <h1 className="text-2xl mobile:text-3xl md:text-4xl font-semibold dark:text-customText-dark">
        {title !== null ? title : "Loading..."}
      </h1>
      {title !== null && <button aria-label="edit" onClick={enterEditTitleMode}><HiPencilSquare /></button>}
    </div>
  )
}
