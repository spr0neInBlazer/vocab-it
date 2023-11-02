import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';
import { Vocab2, Word } from '@/lib/types';

import { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import Link from 'next/link';
import { HiArrowLongLeft, HiPencilSquare, HiTrash } from "react-icons/hi2";
import { ScrollArea } from '@/components/ui/scroll-area';
import SingleWord from '@/components/SingleWord';
import Layout from '@/components/Layout';
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
import { Button } from '@/components/ui/button';
import useProfileStore from '@/lib/profileStore';
import VocabAddWordForm from '@/components/VocabAddWordForm';

// FCP: 1.9s -> 1.5s
// TTFB: 1s -> .167s

const Vocabulary: NextPageWithLayout = () => {
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const router = useRouter();
  const vocabs = useVocabStore(state => state.vocabs);
  const initialFetch = useVocabStore(state => state.initialFetch);
  const editVocabTitle = useVocabStore(state => state.editVocabTitle);
  const deleteStoreVocab = useVocabStore(state => state.deleteVocab);
  const [words, setWords] = useState<Word[]>([]);
  const [currVocab, setCurrVocab] = useState<Vocab2>();
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isAddWord,
    isEditWord,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsAddWord,
    toggleIsEditWord,
  } = useProfileStore(state => state);

  function checkSingleEdit() {
    if (isEditUsername || isEditWordAmount || isAddVocab || isEditWord) {
      return false;
    }
    return true;
  }

  function updateTitle(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title) return;
    // if the title is empty or only consists of spaces
    if (title.length === 0 || !/\S/.test(title)) {
      alert('Enter a valid title');
    } else if (vocabs?.some(v => v.title === title && v._id !== router.query.id)) {
      alert('A vocabulary with this title already exists');
    } else {
      editVocabTitle(router.query.id as string, title);
      setIsEditTitle(false);
    }
  }

  function deleteVocab() {
    deleteStoreVocab(router.query.id as string);
    router.push('/profile/profile');
  }

  function enterEditTitleMode() {
    const isOnlyEdit: boolean = checkSingleEdit();
    if (isOnlyEdit) {
      setIsEditTitle(true);
    } else {
      alert('Please finish editing the other field.');
    }
  }

  useEffect(() => {
    if (!vocabs) {
      initialFetch();
    }
  }, []);

  useEffect(() => {
    if (vocabs && router.query.id) {
      const vocab = vocabs?.find(v => v._id === router.query.id);
      if (vocab) {
        setCurrVocab(vocab);
        setTitle(vocab.title);
        setWords(vocab.words);
      }
    }
  }, [vocabs, router.query.id]);

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
        break;
      case isEditWordAmount:
        toggleIsEditWordAmount();
        break;
      case isAddVocab:
        toggleIsAddVocab();
        break;
      case isAddWord:
        toggleIsAddWord();
        break;
      case isEditWord:
        toggleIsEditWord()
        break;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Vocabulary Details</title>
      </Head>
      <section className="w-11/12 lg:w-3/5 mx-auto mb-6 py-5 px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight flex flex-col border border-zinc-400 dark:border-zinc-300">
        {(isEditTitle && title) ? (
          <form 
            className="flex relative justify-center gap-2 items-center" 
            onSubmit={updateTitle}
          >
            <Link 
              className="absolute left-0 flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2"
              href="/profile/profile"
            >
              <HiArrowLongLeft /> Profile
            </Link>
            <div className="flex justify-between items-center gap-2">
              <input 
                className="text-2xl pl-2 leading-10 border border-slate-600 rounded" type="text" 
                size={15}
                maxLength={15}
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                autoFocus 
              />
              <Button 
                className="bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white dark:text-white"
                onSubmit={updateTitle}
              >
                Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex relative justify-center gap-2 items-center">
            <Link 
              className="absolute left-0 flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2"
              href="/profile/profile"
            >
              <HiArrowLongLeft /> Profile
            </Link>
            <h1 className="text-4xl font-semibold dark:text-customText-dark mb-4">
              {title ? title : "Loading..."}
            </h1>
            {title !== null && <button onClick={enterEditTitleMode}><HiPencilSquare /></button>}
          </div>
        )}
        <p className="text-lg text-center">
          {words.length === 1 ? '1 word' : `${words.length} words`}
        </p>
        <div className="my-5 flex justify-between">
          {(words.length > 0 && router.query.id) ? (
            <button className="text-white rounded-lg py-1 px-3 font-semibold bg-btnBg hover:bg-hoverBtnBg transition-colors">
              <Link href={`/lesson/${encodeURIComponent(router.query.id as string)}`}>
                Start Lesson
              </Link>
            </button>
          ) : (
            <button className="text-gray-300 rounded-lg py-1 px-3 font-semibold bg-btnBg/80 transition-colors cursor-default">
              Start Lesson
            </button>
          )}
          <AlertDialog>
            <AlertDialogTrigger className="flex gap-1 items-center rounded-lg py-1 px-3 font-semibold text-white bg-secondaryBg-light hover:bg-hoverSecondaryBg transition-colors"
            >
              <HiTrash /> Delete Vocabulary
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
                <AlertDialogAction onClick={deleteVocab}>OK</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {words.length > 0 ? (
          <section className="w-3/4 mx-auto">
            <div className="flex px-6 my-2">
              <p className="font-bold w-1/2">Word</p>
              <p className="font-bold w-1/2">Translation</p>
            </div>
            <ScrollArea className="h-[210px] rounded-md border px-4 py-3">
              {words.map(w => {
                return (
                  <SingleWord 
                    key={w.word} 
                    word={w}
                    vocab={currVocab as Vocab2} 
                  />
                )
              })}
            </ScrollArea>
          </section>
        ) : (
          <p className="text-center text-xl font-bold my-5">No words</p>
        )}
        <VocabAddWordForm 
          words={words} 
          id={router.query.id as string} 
          checkSingleEdit={checkSingleEdit}
        />
      </section>
    </>
  )
}

Vocabulary.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Vocabulary;