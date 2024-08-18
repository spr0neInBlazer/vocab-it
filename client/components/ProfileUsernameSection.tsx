import React, { useState } from 'react';
import { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { useToast } from './ui/use-toast';
import useSound from 'use-sound';
import { BASE_URL, SOUND_VOLUME, errorSound, successSound } from '@/lib/globals';
import { Button } from '@/components/ui/button';
import { HiPencilSquare } from "react-icons/hi2";
import useRefreshToken from '@/hooks/useRefreshToken';
import useAuth from '@/hooks/useAuth';

export default function ProfileUsernameSection({ checkSingleEdit }: { checkSingleEdit: CheckSingleEditFunction }) {
  const { storedUsername } = usePreferencesStore();
  const preferenceStore = useStore(usePreferencesStore, (state) => state);
  const {
    isEditUsername,
    toggleIsEditUsername,
  } = useProfileStore(state => state);
  const [userName, setUserName] = useState<string>(storedUsername);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { toast } = useToast();
  const [playError] = useSound(errorSound, { volume: SOUND_VOLUME });
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });
  const refresh = useRefreshToken();
  const fetchWithAuth = useAuth();

  async function updateUsername(e: React.SyntheticEvent) {
    e.preventDefault();
    // if username isn't an empty string and doesn't consist of spaces only
    if (userName.length > 0 && !/^\s*$/.test(userName)) {
      toggleIsEditUsername(); // to false

      let isMounted = true;
      const controller = new AbortController();
      const privateUpdate = async () => {
        try {
          const res = await fetchWithAuth(`${BASE_URL}/profile/updateUsername`, {
            method: 'PUT',
            signal: controller.signal,
            body: JSON.stringify({ username: userName }),
            credentials: 'include'
          });

          if (!res.ok) {
            setUserName(storedUsername);
            toast({
              variant: 'destructive',
              description: "Username could not be updated",
            });
            if (preferenceStore.soundOn) playError();
            throw new Error('Failed to update username');
          }

          await refresh();
          toast({
            variant: 'default',
            description: "Username has been updated",
          });
          if (preferenceStore.soundOn) playSuccess();
          setErrorMsg('');
          console.log('Username updated');
        } catch (error) {
          console.error(error);
        }
      }

      privateUpdate();

      return () => {
        isMounted = false;
        controller.abort();
      }
    } else {
      setUserName(storedUsername);
      if (preferenceStore.soundOn) playError();
      setErrorMsg('Please enter a valid username');
    }
  }

  function enterEditUsernameMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditUsername(); // to true
    } else {
      if (preferenceStore.soundOn) playError();
      alert('Please finish editing the other field');
    }
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setUserName(storedUsername);
      toggleIsEditUsername();
    }
  }

  return (
    <article>
      <h2 className='text-xl mobile:text-2xl md:text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
      {isEditUsername ? (
        <>
          <form
            className="flex gap-3 my-3 w-2/12 justify-between items-center"
            onSubmit={updateUsername}
            data-testid="username-form"
          >
            <div>
              <input
                className="text-lg leading-9 px-2 border rounded"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={checkForAbort}
                size={10}
                maxLength={10}
                autoFocus
                onFocus={() => setErrorMsg('')}
                data-testid="username-input"
              />
            </div>
            <Button
              className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:bg-gray-600 text-white dark:text-white"
              onSubmit={updateUsername}
              aria-label='submit'
            >
              Save
            </Button>
          </form>
          <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
        </>
      ) : (
        <div className="flex gap-2 my-3 w-fit sm:w-2/12 justify-between items-center">
          <p className="text-lg leading-[38px] dark:text-customText-dark">
            {userName}
          </p>
          <button
            className="dark:text-customText-dark py-1 text-lg"
            aria-label='edit'
            onClick={enterEditUsernameMode}
          >
            <HiPencilSquare />
          </button>
        </div>
      )}
      <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
    </article>
  )
}