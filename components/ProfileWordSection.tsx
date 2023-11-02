import React, { useEffect, useState } from 'react';
import { CheckSingleEditFunction } from '@/lib/types';
import useProfileStore from '@/lib/profileStore';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';

import { Button } from '@/components/ui/button';
import { HiPencilSquare } from "react-icons/hi2";

export default function ProfileWordSection({checkSingleEdit}: {checkSingleEdit: CheckSingleEditFunction}) {
  const [wordsPerLesson, setWordsPerLesson] = useState<number>(0);
  const preferenceStore = useStore(usePreferencesStore, (state) => state);
  const {
    isEditWordAmount, 
    toggleIsEditWordAmount,
  } = useProfileStore(state => state);

  function updateWordsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(wordsPerLesson) && wordsPerLesson % 1 === 0 
      && wordsPerLesson > 0 && preferenceStore) {
      preferenceStore.updateLessonVolume(wordsPerLesson);
      toggleIsEditWordAmount(); // to false
    } else {
      setWordsPerLesson(1);
      alert("Enter valid amount of words");
    }
  }

  function enterEditWordsMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      toggleIsEditWordAmount(); // to true
    } else {
      alert('Please finish editing the other field');
    }
  }

  useEffect(() => {
    if (preferenceStore) {
      setWordsPerLesson(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  return (
    <article>
      <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Lessons</h2>
      {/* Lesson schedule feature to add when back-end is implemented */}
      {/* <h3 className="text-xl font-bold dark:text-customText-dark mb-4">Your current schedule:</h3>
      <Select>
        <SelectTrigger className="w-[180px] dark:bg-mainBg-dark">
          <SelectValue placeholder="frequency" />
        </SelectTrigger>
        <SelectContent className="dark:border-customHighlight dark:bg-mainBg-dark">
          {SCHEDULE_OPTIONS.map((option, index) => {
            return <SelectItem className="capitalize hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight dark:focus:bg-customHighlight" key={option} value={option}>{option}</SelectItem>
          })}
        </SelectContent>
      </Select> */}
      <h3 className="text-xl font-bold dark:text-customText-dark my-4">Words per lesson:</h3>
      {isEditWordAmount ? (
        <form className="my-3 max-w-max" onSubmit={updateWordsAmount}>
          <div className="flex gap-3 justify-between items-center">
            <input 
              className="text-lg text-center leading-9 px-2 rounded border border-zinc-400 dark:border-zinc-300" 
              value={wordsPerLesson} 
              onChange={(e) => setWordsPerLesson(Number(e.target.value))} 
              size={5}
              maxLength={3}
              autoFocus 
            />
            <Button 
              className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white dark:text-white"
              onSubmit={updateWordsAmount}
            >
              Update
            </Button>
          </div>
          <p className="text-xs italic mt-2">Enter a number between 5 and 50</p>
        </form>
      ) : (
        <div className="flex my-3 w-2/12 justify-between items-center">
          <p className="text-lg text-center font-semibold dark:text-customText-dark border dark:bg-mainBg-dark px-2 py-1 w-20 rounded">
            {wordsPerLesson}
          </p>
          <button className="dark:text-customText-dark py-1"
            onClick={enterEditWordsMode}
          >
            <HiPencilSquare />
          </button>
        </div>
        )}
    </article>
  )
}