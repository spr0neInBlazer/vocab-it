import React, { ReactElement, useEffect, useState } from 'react';
import VocabList from '@/components/VocabList';

import Head from "next/head";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HiPencilSquare, HiPlus } from "react-icons/hi2";
import useVocabStore from '@/lib/store';
import useStore from '@/hooks/useStore';
import { usePreferencesStore } from '@/lib/preferencesStore';
import { NextPageWithLayout } from '../_app';
import Layout from '@/components/Layout';

// FCP: 1.915s -> 1.363s
// TTFB: .362s -> .213s

const SCHEDULE_OPTIONS = ['every day', 'every 2 days', 'every 3 days', 'once a week'];

const Profile: NextPageWithLayout = () => {
  const [userName, setUserName] = useState<string>('testname');
  const [isEditUserName, setIsEditUserName] = useState<boolean>(false);
  const [wordsPerLesson, setWordsPerLesson] = useState<number>(0);
  const [isEditWords, setIsEditWords] = useState<boolean>(false);
  const [isAddVocab, setIsAddVocab] = useState<boolean>(false);
  const [newVocab, setNewVocab] = useState<string>('');
  const vocabs = useVocabStore(state => state.vocabs);
  const addVocab = useVocabStore(state => state.addVocab);
  const vocabStore = useVocabStore(state => state);
  const preferenceStore = useStore(usePreferencesStore, (state) => state);

  function updateUsername(e: React.SyntheticEvent) {
    e.preventDefault();
    if (userName.length > 0) {
      setIsEditUserName(false);
    }
  }

  function updateWordsAmount(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isNaN(wordsPerLesson) && wordsPerLesson % 1 === 0 
      && wordsPerLesson > 0 && preferenceStore) {
      preferenceStore.updateLessonVolume(wordsPerLesson);
      setIsEditWords(false);
    } else {
      setWordsPerLesson(1);
      alert("Enter valid amount of words");
    }
  }

  function createVocab(e: React.SyntheticEvent) {
    e.preventDefault();

    // if the title is empty or only consists of spaces
    if (newVocab.length === 0 || !/\S/.test(newVocab)) {
      alert('Title is required');
    } 
    // if there's an existing vocab with the entered title
    else if (vocabs?.find(v => v.title === newVocab)) {
      alert('A vocabulary with this title already exists');
    } else {
      setIsAddVocab(false);
      addVocab(newVocab);
    }
    setNewVocab('');
  }

  function cancelAddVocab() {
    setIsAddVocab(false);
    setNewVocab('');
  }

  useEffect(() => {
    if (preferenceStore) {
      setWordsPerLesson(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  // function clearLocalStorage() {
  //   localStorage.removeItem("vi_english");
  //   localStorage.removeItem("vi_french");
  //   localStorage.removeItem("vocabs");
  // }

  return (
    <>
      <Head>
        <title>Account</title>
      </Head>
      {/* <button className="bg-red-500 p-2" onClick={clearLocalStorage}>Clear Local Storage</button> */}

      <section className="w-11/12 lg:w-4/5 mx-auto mt-32 mb-6 py-5 px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight">
        <h1 className='text-4xl text-center font-semibold dark:text-customText-dark mb-4'>My profile</h1>
        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Username</h2>
          {isEditUserName ? (
            <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={updateUsername}>
              <input className="text-lg px-2 border rounded" value={userName} onChange={(e) => setUserName(e.target.value)} size={10} autoFocus />
              <input className="bg-secondaryBg-light dark:bg-customText-dark text-white dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Save" />
            </form>
          ) : (
            <div className="flex my-3 w-2/12 justify-between items-center">
              <p className="text-lg dark:text-customText-dark">{userName}</p>
              <button className="dark:text-customText-dark py-1"
                onClick={() => setIsEditUserName(true)}
              >
                <HiPencilSquare />
              </button>
            </div>
            )}
          <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
        </article>

        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Vocabularies</h2>
          <VocabList key="VocabList" />
          {isAddVocab ? (
            <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={createVocab}>
              <input className="text-lg px-2 rounded" value={newVocab} onChange={(e) => setNewVocab(e.target.value)} size={20} autoFocus />
              <input className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Create" />
              <button className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" onClick={cancelAddVocab}>Cancel</button>
            </form>
            ) : (
            <button className="flex gap-1 items-center rounded-lg py-1 px-3 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg transition-colors"
              onClick={() => setIsAddVocab(true)}
            >
              <HiPlus /> Add Vocabulary
            </button>
          )}
          <div className="h-px w-full dark:bg-mainBg-dark mt-3 mb-5" />
        </article>

        <article>
          <h2 className='text-3xl font-bold dark:text-customText-dark mb-4'>Lessons</h2>
          <h3 className="text-xl font-bold dark:text-customText-dark mb-4">Your current schedule:</h3>
          <Select>
            <SelectTrigger className="w-[180px] dark:bg-mainBg-dark">
              <SelectValue placeholder="frequency" />
            </SelectTrigger>
            <SelectContent className="dark:border-customHighlight dark:bg-mainBg-dark">
              {SCHEDULE_OPTIONS.map((option, index) => {
                return <SelectItem className="capitalize hover:cursor-pointer text-customText-light dark:text-white dark:hover:bg-customHighlight dark:focus:bg-customHighlight" key={option} value={option}>{option}</SelectItem>
              })}
            </SelectContent>
          </Select>
          <h3 className="text-xl font-bold dark:text-customText-dark my-4">Words per lesson:</h3>
          {isEditWords ? (
            <form className="flex gap-3 my-3 w-2/12 justify-between items-center" onSubmit={updateWordsAmount}>
              <input className="text-lg px-2 rounded" value={wordsPerLesson} onChange={(e) => setWordsPerLesson(Number(e.target.value))} size={5} autoFocus />
              <input className="dark:bg-customText-dark dark:text-black cursor-pointer px-3 py-1 rounded" type="submit" value="Update" />
            </form>
          ) : (
            <div className="flex my-3 w-2/12 justify-between items-center">
              <p className="text-lg font-semibold dark:text-customText-dark border dark:bg-mainBg-dark px-2 py-1 w-20 rounded">{wordsPerLesson}</p>
              <button className="dark:text-customText-dark py-1"
                onClick={() => setIsEditWords(true)}
              >
                <HiPencilSquare />
              </button>
            </div>
            )}
        </article>
      </section>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default Profile;