import React, { useEffect, useState } from 'react';
import { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { useToast } from './ui/use-toast';

import { Button } from '@/components/ui/button';
import { HiPencilSquare } from "react-icons/hi2";

export default function ProfileUsernameSection({checkSingleEdit}: {checkSingleEdit: CheckSingleEditFunction}) {
  const preferenceStore = useStore(usePreferencesStore, (state) => state);
  const {
    isEditUsername, 
    toggleIsEditUsername,
  } = useProfileStore(state => state);
  const [userName, setUserName] = useState<string>(preferenceStore?.profileName || 'testname');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const { toast } = useToast();

  function updateUsername(e: React.SyntheticEvent) {
    e.preventDefault();
    // if username isn't an empty string and doesn't consist of spaces only
    if (userName.length > 0 && !/^\s*$/.test(userName)) {
      toggleIsEditUsername(); // to false
      preferenceStore?.updateProfileName(userName);
      toast({
        variant: 'default',
        description: "Username has been successfully updated",
      });
      setErrorMsg('');
    } else {
      // alert('Please enter a valid username')
      setErrorMsg('Please enter a valid username');
    } 
  }
  
  function enterEditUsernameMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditUsername(); // to true
    } else {
      alert('Please finish editing the other field');
    }
  }

  function checkForAbort(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setUserName(preferenceStore.profileName);
      toggleIsEditUsername();
    }
  }

  useEffect(() => {
    if (preferenceStore) {
      setUserName(preferenceStore.profileName);
    }
  }, [preferenceStore]);

  return (
    <article>
      <h2 className='text-xl mobile:text-2xl md:text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
      {isEditUsername ? (
        <>
          <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={updateUsername}>
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
              />
            </div>
            <Button 
              className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white dark:text-white"
              onSubmit={updateUsername}
            >
              Save
            </Button>
          </form>
          <p className="text-sm text-red-800 min-h-4">{errorMsg}</p>
        </>
      ) : (
        <div className="flex gap-1 my-3 w-fit sm:w-2/12 justify-between items-center">
          <p className="text-lg dark:text-customText-dark">{userName}</p>
          <button 
            className="dark:text-customText-dark py-1"
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