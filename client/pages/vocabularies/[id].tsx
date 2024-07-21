import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';
import { Vocab, Word } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import useSound from 'use-sound';
import { SOUND_VOLUME, successSound } from '@/lib/globals';
import { useStore } from 'zustand';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useProfileStore from '@/lib/profileStore';
import dynamic from 'next/dynamic';

import { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import Link from 'next/link';
import { HiArrowLongLeft, HiTrash } from "react-icons/hi2";
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
import VocabAddWordForm from '@/components/VocabAddWordForm';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import VocabTitleSection from '@/components/VocabTitleSection';
import { Skeleton } from '@/components/ui/skeleton';
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";

const WordsTooltip = dynamic(() => import('@/components/WordsTooltip'), {
  loading: () => <HiMiniQuestionMarkCircle />
});

const Vocabulary: NextPageWithLayout = () => {
  const router = useRouter();
  const vocabs = useVocabStore(state => state.vocabs);
  const initialFetch = useVocabStore(state => state.initialFetch);
  const deleteStoreVocab = useVocabStore(state => state.deleteVocab);
  const [words, setWords] = useState<Word[]>([]);
  const [currVocab, setCurrVocab] = useState<Vocab>();
  const {
    isEditUsername,
    isEditWordAmount,
    isAddVocab,
    isAddWord,
    isEditWord,
    isEditVocabTitle,
    toggleIsEditUsername,
    toggleIsEditWordAmount,
    toggleIsAddVocab,
    toggleIsAddWord,
    toggleIsEditWord,
    toggleIsEditVocabTitle
  } = useProfileStore(state => state);
  const { toast } = useToast();
  const soundOn = useStore(usePreferencesStore, (state) => state.soundOn);
  const [playSuccess] = useSound(successSound, { volume: SOUND_VOLUME });

  function checkSingleEdit() {
    if (isAddWord || isEditWord || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  function deleteVocab() {
    deleteStoreVocab(router.query.id as string);
    toast({
      variant: 'default',
      description: "Vocabulary has been successfully deleted",
    });
    if (soundOn) playSuccess();
    router.push('/profile/profile');
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
        setWords(vocab.words);
      }
    }
  }, [vocabs, router.query.id]);

  useEffect(() => {
    // reset all active edit modes 
    switch (true) {
      case isEditUsername:
        toggleIsEditUsername();
      case isEditWordAmount:
        toggleIsEditWordAmount();
      case isAddVocab:
        toggleIsAddVocab();
      case isAddWord:
        toggleIsAddWord();
      case isEditWord:
        toggleIsEditWord();
      case isEditVocabTitle:
        toggleIsEditVocabTitle();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Vocabulary Details</title>
      </Head>
      <section className="w-11/12 lg:w-3/5 mx-auto mb-6 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight flex flex-col border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <div className="grid grid-rows-2 sm:grid-cols-3 gap-3 w-full items-start">
          <Link
            className="w-fit flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2 focus:bg-slate-100 dark:focus:bg-customHighlight2 border border-zinc-400 dark:border-zinc-300"
            href="/profile/profile"
          >
            <HiArrowLongLeft /> Profile
          </Link>
          {currVocab ? (
            <VocabTitleSection
              id={currVocab._id}
              vocabTitle={currVocab.title}
              checkSingleEdit={checkSingleEdit}
            />
          ) : (
            <Skeleton className="justify-self-center h-8 mobile:h-9 md:h-10" />
          )}
        </div>

        <div className="w-full flex gap-2 justify-center items-start">
          <p className="mobile:text-lg">
            {words.length === 1 ? '1 word' : `${words.length} words`}
          </p>
          <WordsTooltip />
        </div>
        <div className="my-5 flex justify-between">
          {(words.length > 0 && router.query.id) ? (
            <button className="text-white rounded-lg py-2 px-3 font-semibold bg-btnBg hover:bg-hoverBtnBg focus:bg-hoverBtnBg transition-colors">
              <Link href={`/lesson/${encodeURIComponent(router.query.id as string)}`}>
                Start Lesson
              </Link>
            </button>
          ) : (
            <button
              className="rounded-lg py-2 px-3 font-semibold bg-btnBg disabled:bg-btnBg/80 disabled:text-zinc-300 cursor-default transition-colors"
              disabled
            >
              Start Lesson
            </button>
          )}
          <AlertDialog>
            <AlertDialogTrigger className="flex gap-1 items-center rounded-lg py-2 px-3 font-semibold text-white bg-secondaryBg-light hover:bg-hoverSecondaryBg focus:bg-hoverSecondaryBg transition-colors"
            >
              <HiTrash /> Delete <span className="hidden mobile:inline">Vocabulary</span>
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
        <section className="w-full mx-auto">
          <div className="flex px-6 my-2">
            <p className="font-bold w-3/5">Word</p>
            <p className="font-bold">Translation</p>
          </div>
          {words.length > 0 ? (
            <ScrollArea className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
              {words.map(w => {
                return (
                  <SingleWord
                    key={w.word}
                    word={w}
                    vocab={currVocab as Vocab}
                    checkSingleEdit={checkSingleEdit}
                  />
                )
              })}
            </ScrollArea>
          ) : (
            <div className="h-[210px] flex justify-center items-center rounded-md border">
              <p className="text-xl font-bold">No words</p>
            </div>
          )}
        </section>
        <VocabAddWordForm
          words={words}
          id={router.query.id as string}
          checkSingleEdit={checkSingleEdit}
        />
      </section>
      <Toaster />
      <Footer />
    </>
  )
}

Vocabulary.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Vocabulary;