import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Word, Answer } from '@/lib/types';
import { usePreferencesStore } from '@/lib/preferencesStore';
import useSound from 'use-sound';

import Head from 'next/head';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import LessonResult from '@/components/LessonResult';
import HintButton from '@/components/HintButton';
import { NextPageWithLayout } from '../_app';
import Layout from '@/components/Layout';
import EndLessonDialog from '@/components/EndLessonDialog';
import { Progress } from "@/components/ui/progress"
import { SOUND_VOLUME, clickSound } from '@/lib/globals';

const initialWordIdx: number = 1;

const Lesson: NextPageWithLayout = () => {
  const preferenceStore = usePreferencesStore(state => state);
  const [lessonVolume, setLessonVolume] = useState<number>(0);
  const [words, setWords] = useState<Word[]>([]);
  const [currWord, setCurrWord] = useState<number>(initialWordIdx);
  const [answer, setAnswer] = useState<string>('');
  const [allAnswers, setAllAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [endLesson, setEndLesson] = useState<boolean>(false);
  const router = useRouter();
  const [playClick] = useSound(clickSound, { volume: SOUND_VOLUME });

  function randomizeWords(array: Word[], volume: number): Word[] {
    let randomizedWords: Word[] = [];
    let sourceArray: Word[] = array;
    for (let i = 0; i < volume; i++) {
      let randomIdx: number = Math.floor(Math.random() * sourceArray.length);
      randomizedWords.push(sourceArray[randomIdx]);
      sourceArray = sourceArray.filter((_, i) => i !== randomIdx);
    }
    return randomizedWords;
  }

  function submitAnswer(e: React.SyntheticEvent) {
    e.preventDefault();
    registerAnswer();
    if (preferenceStore.soundOn) playClick();
  }

  function registerAnswer() {
    const i = currWord - 1;
    // if the answer is wrong
    if (answer.toLocaleLowerCase() !== words[i].word.toLowerCase()) {
      const userAnswer: Answer = {
        userAnswer: answer,
        isCorrect: false,
        word: words[i].translation,
        correctAnswer: words[i].word
      };
      setAllAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    } else {
    // if the answer is correct 
      const userAnswer: Answer = {
        userAnswer: answer,
        isCorrect: true,
      };
      setAllAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
    }
    setCurrWord(currWord + 1);
    setAnswer('');
  }

  function restartLesson() {
    setCurrWord(1);
    setAllAnswers([]);
    const vocab = localStorage.getItem(router.query.id as string);
    if (vocab) {
      const fetchedWords = JSON.parse(vocab).words;
      setWords(randomizeWords(fetchedWords, lessonVolume));
    }
  }
  
  // fetch lessonStore
  // update lessonVolume from lessonStore
  useEffect(() => {
    if (preferenceStore) {
      setLessonVolume(preferenceStore.lessonVolume);
    }
  }, [preferenceStore]);

  // fetch words from local storage and randomize them 
  useEffect(() => {
    if (localStorage && router.query.id) {
      const vocab = localStorage.getItem((router.query.id as string));
      if (vocab) {
        const fetchedWords = JSON.parse(vocab).words;
        setWords(fetchedWords);
      }
    }
  }, [router.query.id]);

  useEffect(() => {
    if (words.length > 0 && lessonVolume > 0) {
      if (lessonVolume > words.length) {
        setLessonVolume(words.length);
        setWords(randomizeWords(words, words.length));
      } else {
        setWords(randomizeWords(words, lessonVolume));
      }
    }
  }, [lessonVolume, words.length]);

  useEffect(() => {
    if (router.query.id && words.length > 0 && preferenceStore) {
      setIsLoading(false);
    } else {
      setIsLoading(true)
    }
  }, [router.query.id, preferenceStore, isLoading, words]);

  // when user ends the lesson, redirect to profile page
  useEffect(() => {
    if (endLesson) {
      router.push('/profile/profile');
    }
  }, [endLesson, router]);

  // end of lesson
  if (currWord > lessonVolume) {
    return (
      <>
        <Head>
          <title>Lesson</title>
        </Head>
        <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
          <LessonResult allAnswers={allAnswers} words={words} />
          <div className="flex justify-between mt-5 px-3">
            <button 
              className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white bg-zinc-600 hover:bg-zinc-500 focus:bg-zinc-500 transition-colors"
              onClick={restartLesson}  
            >
              Start Again
            </button>
            <button className="flex gap-1 items-center rounded-lg p-3 mobile:px-4 text-sm mobile:text-base font-semibold text-white bg-zinc-600 hover:bg-zinc-500 focus:bg-zinc-500 transition-colors">
              <Link href="/profile/profile">
                Back to Profile
              </Link>
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Lesson</title>
      </Head>
      <div className="w-11/12 lg:w-3/5 mx-auto mb-6">
        <p className="mx-3">{currWord}/{lessonVolume}</p>
        <Progress
          className="my-3"
          value={Math.round(((currWord - 1) / lessonVolume) * 100)} 
          aria-label="progress bar"
        />
        <section className="w-full p-4 sm:p-8 rounded-xl bg-white text-customText-light dark:text-customText-dark dark:bg-customHighlight border border-zinc-400 dark:border-zinc-300 shadow-2xl">
          <div>
            <h2 className="text-xl mobile:text-2xl">Word:</h2>
            {!isLoading ? (
              <p className="text-2xl mobile:text-3xl text-center my-3">
                {words[currWord-1].translation}
              </p>
            ) : (
              <div className="w-full flex justify-center my-3">
                <Skeleton className="h-8 mobile:h-9 w-1/4" />
              </div>
            )}
          </div>
          <div className="h-px my-5 w-full bg-zinc-400 dark:bg-mainBg-dark" />
          <div>
            <div className="flex justify-between">
              <h2 className="text-xl mobile:text-2xl">Enter translation:</h2>
              {!isLoading ? (
                <HintButton word={words[currWord-1].word} />
              ) : (
                <Skeleton className="w-[38px] h-[38px] rounded" />
              )}
            </div>
            <form className="my-3 flex justify-center" onSubmit={submitAnswer}>
              <input 
                className="text-2xl leading-10 text-center rounded border border-zinc-400 w-full mobile:w-auto" 
                type="text" 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)} 
                placeholder="Your answer" 
                autoFocus 
              />
            </form>
          </div>
        </section>
        <div className="flex justify-between mt-5 px-3">
          <EndLessonDialog setEndLesson={setEndLesson} />
          <button 
            className="w-16 text-sm mobile:text-base mobile:w-28 flex justify-center items-center rounded-lg py-2 font-semibold text-white bg-zinc-600 hover:bg-zinc-500 focus:bg-zinc-500 transition-colors"
            onClick={registerAnswer}
          >
            Skip
          </button>
          <button 
            className="w-16 text-sm mobile:text-base mobile:w-28 flex justify-center items-center rounded-lg py-2 font-semibold text-white bg-btnBg hover:bg-hoverBtnBg focus:bg-hoverBtnBg transition-colors"
            onClick={registerAnswer}  
          >
            OK
          </button>
        </div>
      </div>
    </>
  )
}

Lesson.getLayout = function getLayout(page: ReactElement) {
  return (<Layout>{page}</Layout>)
}

export default Lesson;