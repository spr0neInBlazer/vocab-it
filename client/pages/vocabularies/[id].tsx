import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useVocabStore from '@/lib/store';
import { Vocab, Word } from '@/lib/types';
import { BASE_URL } from '@/lib/globals';
import useProfileStore from '@/lib/profileStore';
import dynamic from 'next/dynamic';

import { NextPageWithLayout } from '../_app';
import Head from 'next/head';
import Link from 'next/link';
import { HiArrowLongLeft } from "react-icons/hi2";
import { ScrollArea } from '@/components/ui/scroll-area';
import SingleWord from '@/components/SingleWord';
import Layout from '@/components/Layout';
import VocabAddWordForm from '@/components/VocabAddWordForm';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import VocabTitleSection from '@/components/VocabTitleSection';
import { Skeleton } from '@/components/ui/skeleton';
import { HiMiniQuestionMarkCircle } from "react-icons/hi2";
import useAuth from '@/hooks/useAuth';
import DeleteVocabBtn from '@/components/DeleteVocabBtn';
import DeleteWordsBtn from '@/components/DeleteWordsBtn';
import { useAuthStore } from '@/lib/authStore';
import useCheckToken from '@/hooks/useCheckToken';
import RequireAuth from '@/components/RequireAuth';

const Vocabulary: NextPageWithLayout = () => {
  const router = useRouter();
  const {currVocab, setCurrVocab} = useVocabStore(state => state);
  const [words, setWords] = useState<Word[]>([]);
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
  const fetchWithAuth = useAuth();
  const {setIsTokenChecked} = useAuthStore(state => state);
  const {checkToken} = useCheckToken();

  function checkSingleEdit() {
    if (isAddWord || isEditWord || isEditVocabTitle) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setIsTokenChecked(false);
    const controller = new AbortController();

    const getVocabData = async () => {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/vocabs/getVocab`, {
          method: 'POST',
          signal: controller.signal,
          body: JSON.stringify({ _id: router.query.id}),
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Failed to fetch vocab data');
        }

        const vocab = await res.json();      
        setCurrVocab(vocab);
        setWords(vocab.words);
      } catch (error) {
        console.error(error);
      }
    }

    checkToken(getVocabData);

    return () => controller.abort();
  }, [router]);

  useEffect(() => {
    currVocab?.words && setWords(currVocab.words);
  }, [currVocab]);

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
    <RequireAuth allowedRoles={[1305]}>
      <Head>
        <title>Vocabulary | Vocab-It</title>
      </Head>
      <section className="w-11/12 lg:w-3/5 mx-auto mb-6 py-5 px-4 sm:px-8 rounded-3xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight flex flex-col border border-zinc-400 dark:border-zinc-300 shadow-2xl">
        <div className="grid grid-rows-2 sm:grid-cols-3 gap-3 w-full items-start">
          <Link
            className="w-fit flex gap-1 items-center rounded-full py-1 px-3 hover:bg-slate-100 dark:hover:bg-customHighlight2 focus:bg-slate-100 dark:focus:bg-customHighlight2 border border-zinc-400 dark:border-zinc-300"
            href="/profile"
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
        </div>
        <div className="my-5 flex justify-between items-center">
          {(words.length > 0 && router.query.id) ? (
            <button className="text-white rounded-lg py-2 px-3 font-semibold bg-btnBg hover:bg-hoverBtnBg focus:bg-hoverBtnBg transition-colors">
              <Link href={`/lesson/${router.query.id}`}>
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
          <div className="flex flex-col gap-4">
            <DeleteVocabBtn />
            <DeleteWordsBtn />
          </div>
        </div>
        <section className="w-full mx-auto">
          <div className="flex justify-between mobile:px-6 my-2">
            <p className="text-sm sm:text-base font-bold sm:w-1/3">Word</p>
            <p className="text-sm sm:text-base font-bold">Translation</p>
            <p className="text-sm sm:text-base font-bold">Progress</p>
          </div>
          {words.length > 0 ? (
            <ScrollArea className="h-[210px] rounded-md border px-2 sm:px-4 py-3">
              {words.map(w => {
                return (
                  <SingleWord
                    key={w._id}
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
        <VocabAddWordForm checkSingleEdit={checkSingleEdit} />
      </section>
      <Toaster />
      <Footer />
    </RequireAuth>
  )
}

Vocabulary.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Vocabulary;